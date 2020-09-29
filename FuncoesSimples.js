import divi from './utils/divi.js';
import multi from './utils/multi.js';
import soma from './utils/soma.js';
import sqrt from './utils/sqrt.js';
import exp from './utils/exp.js';
import subt from './utils/subt.js';
import getNumberOfArguments from './utils/getNumberOfArguments.js';

import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const variables  = []; // vetor que ficarão as variáveis declaradas pela linguagem

const funcao = 'function';
const string = 'string';
const integer = 'integer'

const FunctionsList = {
  ['sqrt']: [(a)=>{ return sqrt(a)},{args:1}],
  ['mult']: [(a,b)=>{ return multi(a,b)},{args:2}],
  ['subt']: [(a,b)=>{return subt(a,b)},{args:2}],
  ['soma']: [(a,b)=>{return soma(a,b)},{args:2}],
  ['divi']: [(a,b)=>{return divi(a,b)},{args:2}],
  ['exp']:  [(a)=>{return exp(a)},{args:2}]
};


//res = response
const Tokens ={
  [funcao]:(argumentos)=>{

    let {pos,arg,args} = argumentos;
    let position;
    let res;
    
    // criando um novo array com os mesmos elementos de arg
    let this_arg = array_copy(arg,pos); 
        
    let func_name = this_arg.shift(); 
    
    /*o primeiro termo seria o nome de uma função  Ex: soma(subt(a,a),b) arg:[ "subt" , "(" , "a", "," , "a", ")", "," , "b" ] onde subt seria o func_name e seria retirado para obter o seu arg em get_argument_line e func_name usado para saber oq executar e pegar as informações da função */
    pos = pos + get_argument_line(this_arg).length + 3 ;

    /*pegando o  exemplo acima o  get_argument_line de subt seria ["a", "," , "a"] , isso significa que o tamanho dessa função no token é o get_argument_line.length + os itens que foram excluidos que seriam os dois parenteses mais o nome da função [ >"subt"< , "(" , "a", "," , "a", > ")" <] , dessa forma sabemos que a virgula tem que estar no proximo token para obedecer a sintaxe , ou seja , pos = pos(0) + get_argument_line(this_arg).length + 3 . */

    //adiciona o retorno dos valores das funções nested como argumento dessa função
    args.push(resolve_function(this_arg,func_name)); 

    position=pos;

    res = args;
   
    return {position,res}
  },

  [string]:(argumentos)=>{

    let {pos,args,term} = argumentos;

    let position;
    let res;

    args.push(term);
    pos++;
  
    position=pos;
    res = args;

    return {position,res}

  },
  [integer]:(argumentos)=>{
      let {pos,args,term} = argumentos;

      let position;
      let res;

      args.push(term);  
      pos++;

      position=pos;
      res = args;

      return {position,res};
  }
}

function array_copy(array,from = 0){
  
  let new_array = [];

  for(let i = from ; i < array.length ; i++){
    
    new_array.push(array[i]);
    
  }

  return new_array;
}

/*A próxima função verifica se os parenteses estão batendo e retornar o array passado como parametro se estiver certo*/
/*pego o campo da string que está o argumento , por exemplo no array soma(1,2), o vetor de token seria ["soma","(", "1" , "," , "2", ")" ] , essa função pega o campo ["1" , "," , "2"] que vai ser usado em outra função pra pegar os argumentos separadamente , note que devido ao fato de poder ter nested functions vai haver diversos parenteses e como o parentese é usada para delimitar a string, se faz necessário um contador de parenteses pra verificar a sintaxe e pra pegar o campo corretamente. */
function get_argument_line(array){
  

  if(array[0]=="("){
    let pt_count = 1;
    let iterator = 1;
    let new_array = [];

    while(iterator < array.length){
      if(array[iterator] == "("){
        pt_count++;
      }
      if(array[iterator] == ")"){
        pt_count--;
      }
      if(pt_count < 0  ){
        throw new SyntaxError();
      }
      if(pt_count == 0){
        break;
      }
      new_array.push(array[iterator]);
      iterator++;
    }

    if(iterator==array.length){
      throw new SyntaxError("parenteses errados!!");
      // quer dizer que não foi achado o mesmo número de parenteses fechados iguais aos abertos.
    }
    return new_array;
  }
  else{
    throw new SyntaxError("sintaxe da função errada!!")
    //quer dizer que não ouve abertura de parentese apos a definição da função.
  }
}
//informar o tipo do token .

function identify_token(term){
  
  if(parseInt(term)){
    return integer;
  }
  
  if(term.match(/^(".*")|('.*')$/)){
    
    return string;
    
  } // se tiver entre ?apostrofe? ou entre aspas
    
  
  for(let i = 0 ; i<variables.length ; i++){
    if(term == variables[i].name){
      return "variable";
    }
  }
  
 for(let i = 0 ; i <Object.entries(FunctionsList).length ; i++){
    if(term == Object.entries(FunctionsList)[i][0]){
      return funcao;
    }
  } 
  
  return undefined;
  
}

// funçao recursiva que separa os argumentos das funções e das funçoes nested , e as executam  através de uma chamada em árvore onde as raizes seriam as funções sem função nested.
function resolve_function(array,name){
  

  // pega o numero de argumentos da 1 função função , devido ao fato de uma função pode ter varios argumentos o numero de argumentos seria pego ao ser declarada contando os itens no detro parentese quando a função é declarada.
  let n_args = getNumberOfArguments(FunctionsList,name); 

  //espaço que vai ser armazenado os argumentos da função já "numerizados".
  let args=[];                         
  let arg = get_argument_line(array); 

  // vai ser usado para verificar a sintaxe dos termos
  let pos = 0;                  
  
  //primeiro item na string de argumento -> se inteiro ele vai ser o primeiro item em args[] , se função executa a resolve_function nele.
  let term = arg[0];                  
  
  // iteração para caminhar todos os argumentos que serão separados por virgula.
  for(let i = 0 ; i < n_args; i++){   
    
    // numa função soma(a,b) -> arg = ["a", "," , "b"] não se espera uma virgula antes do primeiro token , como em soma(,a,b) => ["," , "a", "," , "b"], portanto na primeira iteração isso vai ser sempre verdadeiro (i=0) sendo coeso com a sintaxe soma (a,b) ou soma(a,b,c) e assim por diante...
    if(!(arg[pos-1]=="," | i== 0)){  
      throw new SyntaxError();
    }

     //Se ao declarar uma função for necessario informar a natureza dos argumentos , como em C => blabla(int a , string b) , seria necessario criar um outro campo em função com a natureza dos argumentos e tambem necessário fazer uma estrutura de fluxo nesses cases abaixo.
    let token = identify_token(term); 
    let response = Tokens[token]({arg,pos,args,term})

    let {position,res} = response;

    args=res;
    pos=position+1;
    term = arg[pos]
   
  }
  

  if(pos!=arg.length+1){
    
    throw new SyntaxError("Número de argumentos inválidos");
    
  }
  
  return FunctionsList[name][0](...args);
} 

rl.question("Insira a sentença ? ",(sentence) => {
  const array = sentence.match(/-?[0-9]+|[A-Za-z0-9]+|\S/g);
  const name = array.shift();

  console.log(resolve_function(array,name));  
});

rl.on("close", function() {
  process.exit(0);
});