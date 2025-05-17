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
  tempo: number; // Adicione isso se existir na API
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
  // Adicione outros campos conforme necessário
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
  // Verificar se route.params e item existem, e fornecer um objeto vazio como fallback
  const { item = {} } = route?.params || {};
  
  // Definir uma cor padrão para ser usada quando item.color não estiver disponível
  const DEFAULT_COLOR = "#f96163";
  
  const [carregando, setCarregando] = useState<boolean>(false);
  const [mostrarPassoAPasso, setMostrarPassoAPasso] = useState<boolean>(false);
  const [receitaAPI, setReceitaAPI] = useState<ReceitaAPI | null>(null);
  const [receitaFormatada, setReceitaFormatada] = useState<ReceitaFormatada | null>(null);
  
  // Tempo padrão por passo em segundos (2 minutos)
  const TEMPO_PADRAO_POR_PASSO = 120;
  
  // API base URL (poderia vir de um arquivo de configuração)
  const API_BASE_URL = "http://192.168.15.4:3000";
  
 const buscarReceitaDaAPI = async () => {
  if (!item?.id) {
    console.error('ID da receita não encontrado');
    setCarregando(false);
    return;
  }
  
  setCarregando(true);
  try {
    // Modifique a URL para incluir o ID na rota
    const response = await axios.get(`${API_BASE_URL}/receitas/${item.id}`);
    
    // Verifique se recebeu dados válidos
    if (response.data) {
      setReceitaAPI(response.data);
      converterFormatoReceita(response.data);
    } else {
      throw new Error('Nenhum dado encontrado');
    }
  } catch (erro) {
    console.error('Erro ao buscar dados da API:', erro);
    alert('Erro ao carregar receita da API.');
  } finally {
    setCarregando(false);
  }
};
  
  // Converter dados da API para o formato esperado pelo componente StepScreen
const converterFormatoReceita = (receita: ReceitaAPI) => {
  // Use a imagem da receita da API
  const imagemUri = receita?.imagem || '';
  
  // Use o tempo específico de cada passo da API (convertendo minutos para segundos)
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
  
  // Efeito para carregar dados da API quando o componente for montado
  useEffect(() => {
    buscarReceitaDaAPI();
  }, []);
  
  // Renderiza o componente de passo a passo
  if (mostrarPassoAPasso && receitaFormatada) {
    return (
      <StepScreen
        receita={receitaFormatada}
        onVoltar={voltarParaDetalhes}
      />
    );
  }
  
  // Renderiza a tela de carregamento
  if (carregando) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: item?.color || DEFAULT_COLOR 
      }}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ marginTop: 16, color: 'white', fontSize: 18 }}>Carregando receita...</Text>
      </View>
    );
  }
  
  // Renderiza a tela normal de detalhes da receita
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
          {item?.image && (
            <Image 
              source={item.image} 
              style={{width: "100%", height: "100%", resizeMode:"contain"}}
            />
          )}
        </View>

        {/*Recipe Name*/}
        <Text style={{marginTop: 160, fontSize: 28, fontWeight: "bold"}}>
          {item?.name || "Nome da Receita"}
        </Text> 

        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/*Recipe Description*/}
            <Text style={{fontSize: 20, marginVertical: 16}}>
              {item?.description || "Descrição não disponível"}
            </Text> 

            {/*Recipe Extra Details*/}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{
                backgroundColor: "rgba(255,0,0,0.38)",
                paddingVertical: 26,
                borderRadius: 8,
                alignItems: "center",
                width: 100,
              }}>
                <Text style={{ fontSize: 40 }}>👨‍🍳</Text>
                <Text style={{fontSize: 20, fontWeight: "400"}}>{item?.difficulty || "N/A"}</Text>
              </View>
              <View style={{
                backgroundColor: "rgba(135,206,235,0.8)",
                paddingVertical: 26,
                borderRadius: 8,
                alignItems: "center",
                width: 100,
              }}>
                <Text style={{ fontSize: 40 }}>⏱️</Text>
                <Text style={{fontSize: 20, fontWeight: "400"}}>{item?.time || "N/A"}</Text>
              </View>
              <View style={{
                backgroundColor: "rgba(255,165,0,0.48)",
                paddingVertical: 26,
                borderRadius: 8,
                alignItems: "center",
                width: 100,
              }}>
                <Text style={{ fontSize: 40 }}>🔥</Text>
                <Text style={{fontSize: 20, fontWeight: "400"}}>{item?.calories || "N/A"}</Text>
              </View>
            </View>

            {/* Botão para iniciar passo a passo */}
            <TouchableOpacity 
              style={styles.botaoIniciarPassoAPasso}
              onPress={iniciarPassoAPasso}
            >
              <Text style={styles.textoBotaoIniciar}>Iniciar Passo a Passo</Text>
            </TouchableOpacity>

            {/*Recipe Ingredients*/}
            <View style={{alignSelf: "flex-start", marginVertical: 22}}>
              <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 6}}>Ingredientes</Text>
              
              {(item?.ingredients || []).map((ingredient: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => {
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
              
              {(!item?.ingredients || item.ingredients.length === 0) && (
                <Text style={{ fontSize: 18, marginLeft: 6 }}>Nenhum ingrediente disponível</Text>
              )}
            </View>

            {/*Recipe Steps*/}
            <View style={{alignSelf: "flex-start", marginVertical: 22}}>
              <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 6}}>
                Passos:
              </Text>
              
              {(item?.steps || []).map((step: any, index: React.Key | null | undefined) => {
                // Convertendo explicitamente index para number para solucionar o erro TypeScript
                const stepNumber = typeof index === 'number' ? index + 1 : 0;
                return (
                  <Text key={index} style={{ fontSize: 18, marginLeft: 6, marginVertical: 6}}>
                    {`${stepNumber} ) ${step}`}
                  </Text>
                );
              })}
              
              {(!item?.steps || item.steps.length === 0) && (
                <Text style={{ fontSize: 18, marginLeft: 6 }}>Nenhum passo disponível</Text>
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
  textoBotaoIniciar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  }
});