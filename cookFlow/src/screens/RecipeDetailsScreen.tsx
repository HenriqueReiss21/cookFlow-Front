import { StyleSheet, Text, View, Image, SafeAreaView, Pressable, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import StepScreen from "./StepScreen";
import axios from "axios";

// Tipos para os dados da API
interface Passo {
  numero: number;
  descricao: string;
  animacao: string;
  tipo: string;
  tempo: number;
}

interface ReceitaAPI {
  _id: string;
  imagem: string;
  titulo: string;
  categoria: string;
  ingredientes: string[];
  passos: Passo[];
  tempoPreparo: string;
  descricao: string;
  dificuldade: string;
  porcoes: number;
  calorias?: number;
  rating?: number;
}

// Tipo para o formato exigido pelo componente ReceitaPassoAPasso
interface PassoReceita {
  id: number;
  descricao: string;
  imagem: string;
  tempoEmSegundos: number;
}

interface ReceitaFormatada {
  titulo: string;
  passos: PassoReceita[];
  color: string;
  recipeId: string;
}

const RecipeDetailsScreen: React.FC<any> = ({ navigation, route }) => {
  const { item = {}, recipeId } = route?.params || {};
  const DEFAULT_COLOR = "#f96163";
  
  const [carregando, setCarregando] = useState<boolean>(false);
  const [mostrarPassoAPasso, setMostrarPassoAPasso] = useState<boolean>(false);
  const [receitaAPI, setReceitaAPI] = useState<ReceitaAPI | null>(null);
  const [receitaFormatada, setReceitaFormatada] = useState<ReceitaFormatada | null>(null);
  const [erroAPI, setErroAPI] = useState<string | null>(null);
  
  const TEMPO_PADRAO_POR_PASSO = 120;
  const API_BASE_URL = "https://cookflow-back.onrender.com";
  const TIMEOUT_REQUEST = 30000;
  
  // Função para obter o ID correto (prioriza recipeId, depois item.id)
  const obterIdReceita = () => {
    const id = recipeId || item?.id || item?._id;
    console.log('IDs disponíveis:', { recipeId, itemId: item?.id, itemUnderscoreId: item?._id });
    console.log('ID selecionado:', id);
    return id;
  };
  
  const buscarReceitaDaAPI = async () => {
    console.log('=== INICIANDO buscarReceitaDaAPI ===');
    
    const idReceita = obterIdReceita();
    
    // Verifica se tem ID para buscar
    if (!idReceita) {
      console.log('❌ ID da receita não encontrado - usando dados locais');
      console.log('Parâmetros da rota:', route.params);
      return;
    }
    
    console.log('✅ ID encontrado, iniciando carregamento da API');
    console.log('ID da receita:', idReceita);
    setCarregando(true);
    setErroAPI(null);
    
    try {
      // Configuração do axios com timeout
      const axiosConfig = {
        timeout: TIMEOUT_REQUEST,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      };
      
      const url = `${API_BASE_URL}/receitas/${idReceita}`;
      console.log(`📡 Fazendo requisição para: ${url}`);
      
      const response = await axios.get(url, axiosConfig);
      
      console.log('📥 Resposta recebida:');
      console.log('Status da resposta:', response.status);
      console.log('Dados recebidos:', response.data);
      
      if (response.data && response.status === 200) {
        console.log('✅ Dados válidos recebidos da API');
        setReceitaAPI(response.data);
        converterFormatoReceita(response.data);
        setErroAPI(null);
        console.log('✅ Dados da API carregados com sucesso');
      } else {
        throw new Error(`Resposta inválida da API. Status: ${response.status}`);
      }
    } catch (erro: any) {
      console.error('❌ Erro detalhado ao buscar dados da API:', erro);
      
      let mensagemErro = 'Erro desconhecido';
      
      if (erro.code === 'ECONNABORTED') {
        mensagemErro = 'Timeout - API demorou para responder';
      } else if (erro.code === 'NETWORK_ERROR' || erro.message?.includes('Network Error')) {
        mensagemErro = 'Erro de conexão com a API';
      } else if (erro.response) {
        mensagemErro = `Erro HTTP ${erro.response.status}: ${erro.response.statusText || erro.response.data?.message || ''}`;
        console.error('Resposta de erro:', erro.response.data);
      } else if (erro.request) {
        mensagemErro = 'Sem resposta da API';
      } else {
        mensagemErro = erro.message;
      }
      
      setErroAPI(mensagemErro);
      console.log(`❌ Continuando com dados locais devido ao erro: ${mensagemErro}`);
      
      // Para debug - mostra alert apenas em desenvolvimento
      if (__DEV__) {
        console.warn(`Debug - Erro API: ${mensagemErro}`);
      }
    } finally {
      setCarregando(false);
      console.log('🏁 Carregamento finalizado');
      console.log('=== FIM buscarReceitaDaAPI ===');
    }
  };
  
  const converterFormatoReceita = (receita: ReceitaAPI) => {
    console.log('=== INICIANDO converterFormatoReceita ===');
    console.log('Receita recebida:', receita);
    
    const imagemUri = receita?.imagem || '';
    console.log('Imagem URI:', imagemUri);
    
    const passosFormatados: PassoReceita[] = receita?.passos?.map(passo => {
      console.log('Convertendo passo:', passo);
      return {
        id: passo.numero,
        descricao: passo.descricao,
        imagem: imagemUri,
        tempoEmSegundos: passo.tempo * 60 || TEMPO_PADRAO_POR_PASSO
      };
    }) || [];
    
    console.log('Passos formatados:', passosFormatados);
    
    const receitaConvertida = {
      titulo: receita?.titulo || "Receita",
      passos: passosFormatados,
      color: item?.color || DEFAULT_COLOR,
      recipeId: receita?._id || ''
    };
    
    console.log('Receita convertida completa:', receitaConvertida);
    
    setReceitaFormatada(receitaConvertida);
    console.log('✅ Estado receitaFormatada atualizado');
    console.log('=== FIM converterFormatoReceita ===');
  };
  
  const iniciarPassoAPasso = async () => {
    console.log('=== INICIANDO PASSO A PASSO ===');
    console.log('Estado atual:');
    console.log('- receitaFormatada:', !!receitaFormatada);
    console.log('- receitaAPI:', !!receitaAPI);
    console.log('- carregando:', carregando);
    
    // Se já tem dados formatados, usa diretamente
    if (receitaFormatada && receitaFormatada.passos.length > 0) {
      console.log('✅ Usando dados já carregados');
      console.log('Passos disponíveis:', receitaFormatada.passos.length);
      setMostrarPassoAPasso(true);
      return;
    }
    
    // Se tem dados da API mas não estão formatados, converte
    if (receitaAPI) {
      console.log('✅ Convertendo dados da API');
      console.log('Passos na API:', receitaAPI.passos?.length || 0);
      converterFormatoReceita(receitaAPI);
      setMostrarPassoAPasso(true);
      return;
    }
    
    // Se tem ID mas não carregou ainda, tenta carregar
    const idReceita = obterIdReceita();
    if (idReceita && !carregando) {
      console.log('✅ Tentando carregar dados da API antes de iniciar');
      console.log('ID da receita:', idReceita);
      
      await buscarReceitaDaAPI();
      
      // Aguarda um momento para o estado atualizar
      setTimeout(() => {
        if (receitaFormatada && receitaFormatada.passos.length > 0) {
          console.log('✅ Conseguiu carregar e formatar');
          setMostrarPassoAPasso(true);
        } else {
          console.log('❌ Não conseguiu carregar da API');
          alert('Não foi possível carregar os passos da receita. Tente novamente.');
        }
      }, 100);
      
      return;
    }
    
    // Fallback: se não tem dados da API, tenta criar com dados locais
    if (item?.steps && item.steps.length > 0) {
      console.log('✅ Criando passo a passo com dados locais');
      console.log('Passos locais encontrados:', item.steps.length);
      
      const passosLocais: PassoReceita[] = item.steps.map((step: string, index: number) => ({
        id: index + 1,
        descricao: step,
        imagem: '', // Dados locais podem não ter imagem por passo
        tempoEmSegundos: TEMPO_PADRAO_POR_PASSO
      }));
      
      const receitaLocal = {
        titulo: item?.name || "Receita",
        passos: passosLocais,
        color: item?.color || DEFAULT_COLOR,
        recipeId: idReceita || ''
      };
      
      console.log('Receita local criada:', receitaLocal);
      setReceitaFormatada(receitaLocal);
      setMostrarPassoAPasso(true);
    } else {
      console.log('❌ Nenhum passo disponível');
      alert('Nenhum passo disponível para esta receita.');
    }
    
    console.log('=== FIM DA FUNÇÃO INICIAR PASSO A PASSO ===');
  };
  
  const voltarParaDetalhes = () => {
    setMostrarPassoAPasso(false);
  };
  
  // Hook para tentar carregar dados na montagem
  useEffect(() => {
    console.log('=== useEffect EXECUTADO ===');
    console.log('=== Componente RecipeDetailsScreen montado ===');
    console.log('Item recebido:', item);
    console.log('RecipeId recebido:', recipeId);
    console.log('Route params completo:', route?.params);
    
    const idReceita = obterIdReceita();
    
    // Só tenta carregar se tem ID
    if (idReceita) {
      console.log('✅ ID encontrado no useEffect, iniciando carregamento da API');
      console.log('ID:', idReceita);
      buscarReceitaDaAPI();
    } else {
      console.log('❌ Nenhum ID encontrado no useEffect, usando apenas dados locais');
      console.log('Parâmetros disponíveis:', Object.keys(route?.params || {}));
    }
    console.log('=== FIM useEffect ===');
  }, [recipeId, item?.id]); // Dependências corretas
  
  // Renderiza tela de passo a passo se solicitado
  if (mostrarPassoAPasso && receitaFormatada) {
    return (
      <StepScreen
        receita={receitaFormatada}
        onVoltar={voltarParaDetalhes}
      />
    );
  }
  
  // Renderiza loading
  if (carregando) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: item?.color || DEFAULT_COLOR }]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Carregando receita...</Text>
        {/* Debug info - remover em produção */}
        {__DEV__ && (
          <>
            <Text style={styles.debugText}>ID: {obterIdReceita() || 'não encontrado'}</Text>
            <Text style={styles.debugText}>URL: {API_BASE_URL}/receitas/{obterIdReceita()}</Text>
          </>
        )}
      </View>
    );
  }
  
  // Função para obter dados mesclados (prioriza API, fallback para item)
  const obterDadosMesclados = () => {
    const dados = {
      nome: receitaAPI?.titulo || item?.name || "Nome da Receita",
      descricao: receitaAPI?.descricao || item?.description || "Descrição não disponível",
      ingredientes: receitaAPI?.ingredientes || item?.ingredients || [],
      passos: receitaAPI?.passos || item?.steps || [],
      dificuldade: receitaAPI?.dificuldade || item?.difficulty || "N/A",
      tempo: receitaAPI?.tempoPreparo || item?.time || "N/A",
      porcoes: receitaAPI?.porcoes || item?.calories || "N/A",
      calorias: receitaAPI?.calorias || item?.calories || "N/A",
      imagem: receitaAPI?.imagem || null,
      imagemLocal: item?.image || null
    };
    
    console.log('Dados mesclados:', {
      fonte: receitaAPI ? 'API' : 'Local',
      nome: dados.nome,
      ingredientesCount: dados.ingredientes.length,
      passosCount: dados.passos.length
    });
    
    return dados;
  };
  
  const dados = obterDadosMesclados();
  
  return (
    <View style={{ backgroundColor: item?.color || DEFAULT_COLOR, flex: 1 }}> 
      <SafeAreaView style={{ flexDirection: "row", marginHorizontal: 16 }}>
        <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()}>
          <FontAwesome 
            name={"arrow-circle-left"} 
            size={28} 
            color="red"    
          />
        </Pressable>
          
        <FontAwesome name={"heart-o"} size={28} color="white"/>
      </SafeAreaView>
      
      <View style={{ 
          backgroundColor: "#fff",
          flex: 1,
          marginTop: 240,
          borderTopLeftRadius: 56,
          borderBottomRightRadius: 56,
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <View style={{ 
            height: 300, 
            width: 300, 
            position: "absolute", 
            top: -150
          }}
        >
          {/* Renderiza imagem da API (URL) ou imagem local */}
          {dados.imagem ? (
            <Image 
              source={{ uri: dados.imagem }} 
              style={{width: "100%", height: "100%", resizeMode:"contain"}}
              onError={(error) => console.log('Erro ao carregar imagem da API:', error.nativeEvent.error)}
            />
          ) : dados.imagemLocal ? (
            <Image 
              source={dados.imagemLocal} 
              style={{width: "100%", height: "100%", resizeMode:"contain"}}
              onError={(error) => console.log('Erro ao carregar imagem local:', error.nativeEvent.error)}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>📷</Text>
            </View>
          )}
        </View>

        <Text style={{marginTop: 160, fontSize: 28, fontWeight: "bold"}}>
          {dados.nome}
        </Text> 

        {/* Mostra indicador de fonte dos dados em desenvolvimento */}
        {__DEV__ && (
          <Text style={styles.fontIndicator}>
            Dados: {receitaAPI ? '🌐 API' : '📱 Local'}
            {erroAPI && ` (Erro: ${erroAPI})`}
          </Text>
        )}

        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={{fontSize: 20, marginVertical: 16}}>
              {dados.descricao}
            </Text> 

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{
                backgroundColor: "rgba(255,0,0,0.38)",
                paddingVertical: 26,
                borderRadius: 8,
                alignItems: "center",
                width: 100,
              }}>
                <Text style={{ fontSize: 40 }}>👨‍🍳</Text>
                <Text style={{fontSize: 20, fontWeight: "400"}}>{dados.dificuldade}</Text>
              </View>
              <View style={{
                backgroundColor: "rgba(135,206,235,0.8)",
                paddingVertical: 26,
                borderRadius: 8,
                alignItems: "center",
                width: 100,
              }}>
                <Text style={{ fontSize: 40 }}>⏱️</Text>
                <Text style={{fontSize: 20, fontWeight: "400"}}>{dados.tempo}</Text>
              </View>
              <View style={{
                backgroundColor: "rgba(255,165,0,0.48)",
                paddingVertical: 26,
                borderRadius: 8,
                alignItems: "center",
                width: 100,
              }}>
                <Text style={{ fontSize: 40 }}>🔥</Text>
                <Text style={{fontSize: 20, fontWeight: "400"}}>{dados.porcoes}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[
                styles.botaoIniciarPassoAPasso,
                (!receitaFormatada && !dados.passos.length) && styles.botaoDesabilitado
              ]}
              onPress={iniciarPassoAPasso}
              disabled={carregando}
            >
              <Text style={[
                styles.textoBotaoIniciar,
                (!receitaFormatada && !dados.passos.length) && styles.textoBotaoDesabilitado
              ]}>
                {carregando ? 'Carregando...' : 'Iniciar Passo a Passo'}
              </Text>
            </TouchableOpacity>

            <View style={{alignSelf: "flex-start", marginVertical: 22}}>
              <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 6}}>Ingredientes</Text>
              
              {dados.ingredientes.map((ingredient: string, index: number) => {
                return (
                  <View key={index} style={{
                    flexDirection: "row", 
                    alignItems: "center",
                    marginVertical: 4 
                  }}>
                    <View style={{ 
                      backgroundColor: "red",
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                    }}></View>
                    <Text style={{ fontSize: 18, marginLeft: 6}}>{ingredient}</Text>
                  </View>
                );
              })}
              
              {dados.ingredientes.length === 0 && (
                <Text style={{ fontSize: 18, marginLeft: 6, color: '#666' }}>
                  Nenhum ingrediente disponível
                </Text>
              )}
            </View>

            <View style={{alignSelf: "flex-start", marginVertical: 22}}>
              <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 6}}>
                Passos:
              </Text>
              
              {dados.passos.map((step: any, index: number) => {
                // Para dados da API, step é um objeto Passo, para dados locais é string
                const descricaoStep = typeof step === 'string' ? step : step.descricao;
                
                return (
                  <Text key={index} style={{ fontSize: 18, marginLeft: 6, marginVertical: 6}}>
                    {`${index + 1}) ${descricaoStep}`}
                  </Text>
                );
              })}
              
              {dados.passos.length === 0 && (
                <Text style={{ fontSize: 18, marginLeft: 6, color: '#666' }}>
                  Nenhum passo disponível
                </Text>
              )}
            </View> 
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default RecipeDetailsScreen;

const styles = StyleSheet.create({
  botaoIniciarPassoAPasso: {
    backgroundColor: "red",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  botaoDesabilitado: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  textoBotaoIniciar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  textoBotaoDesabilitado: {
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  debugText: {
    marginTop: 8,
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  fontIndicator: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 60,
    opacity: 0.5,
  },
});