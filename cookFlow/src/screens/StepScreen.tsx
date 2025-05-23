import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  StatusBar,
  Pressable,
  ScrollView,
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";

// Definição de tipos
interface PassoReceita {
  id: number;
  descricao: string;
  imagem: string;
  tempoEmSegundos: number;
}

interface ReceitaProps {
  titulo: string;
  passos: PassoReceita[];
  color: string; // Cor de fundo da receita
}

interface StepScreenProps {
  receita: ReceitaProps;
  onVoltar: () => void;
}

const StepScreen: React.FC<StepScreenProps> = ({ receita, onVoltar }) => {
  const [passoAtual, setPassoAtual] = useState<number>(0);
  const [tempoRestante, setTempoRestante] = useState<number>(0);
  const [timerAtivo, setTimerAtivo] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  
  const totalPassos: number = receita.passos.length;
  
  // Inicializa o temporizador quando um novo passo é carregado
  useEffect(() => {
    const tempoPassoAtual = receita.passos[passoAtual]?.tempoEmSegundos || 0;
    setTempoRestante(tempoPassoAtual);
    // Limpa o timer anterior se existir
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerAtivo(false);
  }, [passoAtual, receita.passos]);
  
  // Gerencia o temporizador
  useEffect(() => {
    if (timerAtivo && tempoRestante > 0) {
      timerRef.current = setInterval(() => {
        setTempoRestante(prev => {
          if (prev <= 1) {
            if (timerRef.current !== null) {
              clearInterval(timerRef.current);
            }
            setTimerAtivo(false);
            Alert.alert("Tempo finalizado!", "Este passo está completo.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as unknown as number; // Casting para compatibilidade com React Native
    } else if (tempoRestante <= 0 && timerAtivo) {
      setTimerAtivo(false);
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    }
    
    // Limpa o intervalo quando o componente é desmontado
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerAtivo, tempoRestante]);
  
  // Formata o tempo para exibição MM:SS
  const formatarTempo = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segsRestantes = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segsRestantes.toString().padStart(2, '0')}`;
  };
  
  // Funções para navegar entre os passos
  const irParaProximoPasso = (): void => {
    if (passoAtual < totalPassos - 1) {
      setPassoAtual(passoAtual + 1);
    } else {
      Alert.alert("Receita concluída!", "Parabéns! Você finalizou todos os passos.");
      onVoltar();
    }
  };
  
  const irParaPassoAnterior = (): void => {
    if (passoAtual > 0) {
      setPassoAtual(passoAtual - 1);
    }
  };
  
  // Inicia ou pausa o temporizador
  const alternarTimer = (): void => {
    setTimerAtivo(!timerAtivo);
  };
  
  // Reinicia o temporizador
  const reiniciarTimer = (): void => {
    setTempoRestante(receita.passos[passoAtual]?.tempoEmSegundos || 0);
    setTimerAtivo(false);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: receita.color }]}>
      <SafeAreaView style={styles.header}>
        <Pressable style={{ flex: 1 }} onPress={onVoltar}>
          <FontAwesome name={"arrow-circle-left"} size={28} color="red" />
        </Pressable>
      </SafeAreaView>
      
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>{receita.titulo}</Text>
            <Text style={styles.progresso}>Passo {passoAtual + 1} de {totalPassos}</Text>
          </View>
          
          {receita.passos[passoAtual] && (
            <View style={styles.conteudoPasso}>
              {/* Imagem do passo */}
              <Image 
                source={{ uri: receita.passos[passoAtual].imagem }} 
                style={styles.imagem}
                resizeMode="contain"
              />
              
              {/* Descrição do passo */}
              <View style={styles.descricaoContainer}>
                <Text style={styles.descricao}>
                  {receita.passos[passoAtual].descricao}
                </Text>
              </View>
              
              {/* Temporizador */}
              <View style={styles.timerContainer}>
                <Text style={styles.timerTexto}>
                  {formatarTempo(tempoRestante)}
                </Text>
                <View style={styles.timerBotoes}>
                  <TouchableOpacity 
                    style={[styles.botao, styles.botaoTimer]} 
                    onPress={alternarTimer}
                  >
                    <Text style={styles.botaoTexto}>
                      {timerAtivo ? "Pausar" : "Iniciar"} Timer
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.botao, styles.botaoTimer]} 
                    onPress={reiniciarTimer}
                  >
                    <Text style={styles.botaoTexto}>Reiniciar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          
          {/* Navegação entre passos */}
          <View style={styles.navegacao}>
            <TouchableOpacity 
              style={[
                styles.botao, 
                styles.botaoNavegacao, 
                passoAtual === 0 ? styles.botaoDesativado : null
              ]} 
              onPress={irParaPassoAnterior}
              disabled={passoAtual === 0}
            >
              <Text style={styles.botaoTexto}>Anterior</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.botao, styles.botaoNavegacao]} 
              onPress={irParaProximoPasso}
            >
              <Text style={styles.botaoTexto}>
                {passoAtual === totalPassos - 1 ? "Finalizar" : "Próximo"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
  },
  contentContainer: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 56,
    borderBottomRightRadius: 56,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  cabecalho: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3c444c',
    marginBottom: 8,
  },
  progresso: {
    fontSize: 18,
    color: 'red',
    fontWeight: '600',
  },
  conteudoPasso: {
    flex: 1,
    padding: 16,
  },
  imagem: {
    width: '100%',
    height: 220,
    borderRadius: 22,
    marginBottom: 24,
  },
  descricaoContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  descricao: {
    fontSize: 18,
    lineHeight: 26,
    color: '#3c444c',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timerTexto: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  timerBotoes: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navegacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  botao: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  botaoNavegacao: {
    backgroundColor: 'red',
    minWidth: 140,
  },
  botaoTimer: {
    backgroundColor: 'red',
    marginHorizontal: 8,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  botaoDesativado: {
    backgroundColor: '#d9d9d9',
  },
});

export default StepScreen;