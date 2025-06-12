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
  const { item = {} } = route?.params || {};
  const DEFAULT_COLOR = "#f96163";
  
  const [carregando, setCarregando] = useState<boolean>(false);
  const [mostrarPassoAPasso, setMostrarPassoAPasso] = useState<boolean>(false);
  const [receitaAPI, setReceitaAPI] = useState<ReceitaAPI | null>(null);
  const [receitaFormatada, setReceitaFormatada] = useState<ReceitaFormatada | null>(null);
  
  const TEMPO_PADRAO_POR_PASSO = 120;
  const API_BASE_URL = "https://cookflow-back.onrender.com";
  
  const buscarReceitaDaAPI = async () => {
    // Se não tem ID, não precisa carregar da API - usa dados locais
    if (!item?.id) {
      console.log('ID da receita não encontrado - usando dados locais');
      setCarregando(false);
      return;
    }
    
    console.log('Iniciando busca na API para ID:', item.id);
    setCarregando(true);

    const converterFormatoReceita = (receita: ReceitaAPI) => {
      const imagemUri = receita?.imagem || '';
      
      const passosFormatados: PassoReceita[] = receita?.passos?.map(passo => ({
        id: passo.numero,
        descricao: passo.descricao,
        imagem: imagemUri,
        tempoEmSegundos: passo.tempo * 60 || TEMPO_PADRAO_POR_PASSO
      })) || [];
      
      setReceitaFormatada({
        titulo: receita?.titulo || "Receita",
        passos: passosFormatados,
        color: item?.color || DEFAULT_COLOR,
        recipeId: receita?._id || ''
      });
    };

    try {
      const response = await axios.get(`${API_BASE_URL}/receitas/${item.id}`);
      console.log('Resposta da API:', response.data);
    
      if (response.data) {
        converterFormatoReceita(response.data);
        setReceitaAPI(response.data);
        console.log('Dados da API carregados com sucesso');
      } else {
        throw new Error('Nenhum dado encontrado na resposta');
      }
    } catch (erro) {
      if (erro instanceof Error) {
        console.error('Erro ao buscar receita:', erro.message);
      } else {
        console.error('Erro desconhecido:', erro);
      }
    } finally {
      setCarregando(false);
    }
  };

  const iniciarPassoAPasso = () => {
    if (!receitaFormatada) {
      buscarReceitaDaAPI();
    } else {
      setMostrarPassoAPasso(true);
    }
  };
  
  const voltarParaDetalhes = () => {
    setMostrarPassoAPasso(false);
  };
  
  useEffect(() => {
    console.log('Componente montado. Item recebido:', item);
    buscarReceitaDaAPI();
  }, [item.id]); // Dependência do ID para recarregar se mudar
  
  if (mostrarPassoAPasso && receitaFormatada) {
    return (
      <StepScreen
        receita={receitaFormatada}
        onVoltar={voltarParaDetalhes}
      />
    );
  }
  
  if (carregando) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: item?.color || DEFAULT_COLOR }]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Carregando receita...</Text>
        {/* Debug info - remover em produção */}
        <Text style={styles.debugText}>ID: {item?.id || 'não encontrado'}</Text>
      </View>
    );
  }
  
  // Função para obter dados mesclados (prioriza API, fallback para item)
  const obterDadosMesclados = () => {
    return {
      nome: receitaAPI?.titulo || item?.name || "Nome da Receita",
      descricao: receitaAPI?.descricao || item?.description || "Descrição não disponível",
      ingredientes: receitaAPI?.ingredientes || item?.ingredients || [],
      passos: receitaAPI?.passos || item?.steps || [],
      dificuldade: receitaAPI?.dificuldade || item?.difficulty || "N/A",
      tempo: receitaAPI?.tempoPreparo || item?.time || "N/A",
      porcoes: receitaAPI?.porcoes || item?.calories || "N/A",
      imagem: receitaAPI?.imagem || null,
      imagemLocal: item?.image || null
    };
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
            />
          ) : dados.imagemLocal ? (
            <Image 
              source={dados.imagemLocal} 
              style={{width: "100%", height: "100%", resizeMode:"contain"}}
            />
          ) : null}
        </View>

        <Text style={{marginTop: 160, fontSize: 28, fontWeight: "bold"}}>
          {dados.nome}
        </Text> 

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
              style={styles.botaoIniciarPassoAPasso}
              onPress={iniciarPassoAPasso}
            >
              <Text style={styles.textoBotaoIniciar}>Iniciar Passo a Passo</Text>
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
                <Text style={{ fontSize: 18, marginLeft: 6 }}>Nenhum ingrediente disponível</Text>
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
                <Text style={{ fontSize: 18, marginLeft: 6 }}>Nenhum passo disponível</Text>
              )}
            </View> 
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

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
  textoBotaoIniciar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
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
});

export default RecipeDetailsScreen;