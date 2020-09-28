//let string = "mult(4,soma(3,2))";
let string = "mult(mult(subt(2,3),soma(3,2)),mult(mult(3,2),sqrt(16)))";
let array = string.match(/-?[0-9]+|[A-Za-z0-9]+|\S/g);
// -?[0-9]+ -> pega uma combinação de string(+) de numeros de 0 a 9([0-9]) antecedidos ou não de -(?). Vai agrupar combinação de números APENAS.
// | -> ou
//[A-Za-z0-9]+ -> pega uma combinação de string(+) de letras maiusculas ou minusculas e numeros [A-Za-z0-9]; => Vai agrupar combinação de letras com números
//  \S pega qualquer coisa sem ser espaço. Necessário  para agrupar simbolos.
// / ... / => indicador de regex // g -> pega todas ocorrências              
let functions =  [{name: "subt", args: 2 },{name: "soma", args: 2},{name:"divi", args : 2},{name:"mult",args: 2},{name:"exp",args: 2},{name:"sqrt",args: 1}]; // vetor com as funções que serão declaradas pela linguagem
let variables  = []; // vetor que ficarão as variáveis declaradas pela linguagem
function exec_function(name,args){ 
  /*funções que são executadas no javascript , acho que como as funções declaradas pela linguagem L tem instruções próprias provavelmente elas terão de ser compiladas por uma função análoga ao que compilará o codigo. Essas instruções provavelmente terão que ser aramzenadas em um campo no objeto de funções.//As funções abaixo executam o que a gente planejou e acho que elas são usadas para dar overload nos operators ==> (+,-,*,/,^). (Não sei se é necessário mas pelo que ta no site dele parece que ele quer.(Acho que não é muito difícil ))  */
  
  switch(name){ 
      
    case "mult":
      return Math.round(args[0] * args[1]);
    case "soma":
      return Math.round(args[0] + args[1]);
    case "subt":
      return Math.round(args[0] - args[1]);
    case "divi":
      return Math.round(args[0] / args [1]);
    case "exp":
      return Math.round(args[0] ^ args[1]);
    case "sqrt":
      return Math.round(Math.sqrt(args[0]));
  }
    
}
/*função que copia um array para outro , diferença dela pra array1 = array2 é que nesse caso se vc fazer alteração em um fará no outro . Se eu só copiar os elementos por meio de uma função como a abaixo, serão dois vetores independetes e portanto, fazendo alteração em um não afeta o outro. */
function array_copy(array,from = 0){
  
  let new_array = [];
  for(let i = from ; i < array.length ; i++){
    
    new_array.push(array[i]);
    
  }
  return new_array;
}

function get_number_of_arguments(Function){
  
   return functions.find(obj => obj.name == Function).args;
  
  
}
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
      if(pt_count < 0 ){
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
    return "integer";
  }
  
  if(term.match(/^(".*")|('.*')$/)){
    
    return "string";
    
  } // se tiver entre ?apostrofe? ou entre aspas
    
  
 for(let i = 0 ; i<variables.length ; i++){
    if(term == variables[i].name){
      return "variable";
    }
  }
  
 for(let i = 0 ; i<functions.length ; i++){
    if(term == functions[i].name){
      return "function";
    }
  } 
  
  return undefined;
  
}
// funçao recursiva que separa os argumentos das funções e das funçoes nested , e as executam  através de uma chamada em árvore onde as raizes seriam as funções sem função nested.

function resolve_function(array,name){
  

  let n_args = get_number_of_arguments(name); // pega o numero de argumentos da função , devido ao fato de uma função pode ter varios argumentos o numero de argumentos seria pego ao ser declarada contando os itens no detro parentese quando a função é declarada.
  let args=[];                          //espaço que vai ser armazenado os argumentos da função já "numerizados".
  let arg = get_argument_line(array); 
  let pos = 0;                         // vai ser usado para verificar a sintaxe dos termos
  let term = arg[0];                   //primeiro item na string de argumento -> se inteiro ele vai ser o primeiro item em args[] , se função executa a resolve_function nele. 
  for(let i = 0 ; i < n_args; i++){    // iteração para caminhar todos os argumentos que serão separados por virgula.
    
    if(arg[pos-1]=="," | i== 0){  // numa função soma(a,b) -> arg = ["a", "," , "b"] não se espera uma virgula antes do primeiro token , como em soma(,a,b) => ["," , "a", "," , "b"], portanto na primeira iteração isso vai ser sempre verdadeiro (i=0) sendo coeso com a sintaxe soma (a,b) ou soma(a,b,c) e assim por diante...
      
    }
    else{
      throw new SyntaxError();
    }
    switch (identify_token(term)){   //Se ao declarar uma função for necessario informar a natureza dos argumentos , como em C => blabla(int a , string b) , seria necessario criar um outro campo em função com a natureza dos argumentos e tambem necessário fazer uma estrutura de fluxo nesses cases abaixo.

      case "function":
          
        
        let this_arg = array_copy(arg,pos); // criando um novo array com os mesmos elementos de arg
        let func_name = this_arg.shift(); 
        
        /*o primeiro termo seria o nome de uma função  Ex: soma(subt(a,a),b) arg:[ "subt" , "(" , "a", "," , "a", ")", "," , "b" ] onde subt seria o func_name e seria retirado para obter o seu arg em get_argument_line e func_name usado para saber oq executar e pegar as informações da função */
        pos = pos + get_argument_line(this_arg).length + 3 ;
        
        /*pegando o  exemplo acima o  get_argument_line de subt seria ["a", "," , "a"] , isso significa que o tamanho dessa função no token é o get_argument_line.length + os itens que foram excluidos que seriam os dois parenteses mais o nome da função [ >"subt"< , "(" , "a", "," , "a", > ")" <] , dessa forma sabemos que a virgula tem que estar no proximo token para obedecer a sintaxe , ou seja , pos = pos(0) + get_argument_line(this_arg).length + 3 . */
        
        args.push(resolve_function(this_arg,func_name));    //adiciona o retorno dos valores das funções nested como argumento dessa função

        
        break;

      case "integer":
        
        args.push(parseInt(term));
        pos++;
        break;
        
      case "string":
        
          args.push(term);
          pos++
          break;
        
      case "variable":
        
          args.push(term.value);  
          pos++;
          break;

      default:
        throw new SyntaxError("string não encontrada na posição " + pos);
        //string não reconhecida
      }
    pos++;
    term = arg[pos]
   
  }
  

  if(pos!=arg.length+1){
    
    throw new SyntaxError("Número de argumentos inválidos");
    
  }
  
  return exec_function(name,args);
 
  
} 
let name = array.shift();
console.log(resolve_function(array,name));

/* DILEMA:

   Esse algoritmo pode ser usado para resolver uma função que vai ser declarada na linguagem L , porém uma função declarada na linguagem L não vai ter como ser resolvida em javascript como é o caso dessas funções soma , subt etc q usam a exec_function escrita em javascript para resolvê-las. Portanto para uma função escrita no programa não poderia ser chamada a exec function e sim as instruções delas. 
  POSSÍVEL SOLUÇÃO: Isso pode ser resolvido por uma estrutura de fluxo, onde se a função pega não for as nossas funções de javascript eu executar as suas próprias instruções por meio de um ?CompileFunction()?









/* ==================================================================================== IMPORTANTE  =========================================================================



Á FAZER:


  * Um compilador que vai pegar tokens por linha. (usar um regex para parar em \n)[[token1_linha1,token2_linha1,token3_linha1...],[token1_linha2,token2_linha2,token3_linha2...],[token1_linha3,token2_linha3,token3_linha3...],...] (relativamente fácil).
  
  
  *declarador de variaveis -> sintaxe: var a = 3  (var vai adicionar um vetor a com valor 3 (se a não existe). Obs tambem pode ser igualada por uma função que terá que ser resolvida se for o caso.) (talvez fácil)
  
  *Overload de operadores e reconhecer parenteses como ordem de prioridade (pode ser complicado);
  
  
  *O compilador vai ter que ter cada linha salva, e em cada linha identifcar o que cada token representa e o que esperar como próximo token e saber como jogar os erros caso algo dê errado(com certeza vai ser duro esse). 

  *Declarar funções=> obedecer a sintaxe , salvar os dados da função como objeto e compilar as suas instruções ao ser chamada (Sua Compilação  vai ser como a do compilador do código só que com sintaxe propria e retornando algo)(vmo ter que ser godlike);  */
  
<h3>How To Use</h3>

To clone and run this application, you'll need [Git](https://git-scm.com), [Node.js v10.16][nodejs] or higher + [Yarn v1.13][yarn] or higher, installed on your computer. From your command line:
  
  ```bash
# Clone this repository
$ git https://github.com/joaovitor32/Linguagem-L

# Go into the repository
$ cd Linguagem-L

# Install dependencies
$ npm install

# Run the app
$ npm start

```
