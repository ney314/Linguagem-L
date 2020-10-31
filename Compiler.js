class armazenamento{

    constructor(lista){

        this.lista = lista
    }

    add_var(nome,valor=undefined){
        for(let i=0; i<this.lista.length;i++){
            if(this.lista[i].nome==nome){
                
                if(this.lista[i].identificador=="Função"){
                    throw new Error(nome + " já foi declarada como função")
                }
                else{
                    this.lista[i] = cria_var_objeto(nome,valor)
                    return;
                }
            }
        }
        this.lista.push(cria_var_objeto(nome,valor)); 
    }
    add_vetor(nome,array){

        for(let i=0; i<this.lista.length;i++){
            if(this.lista[i].nome==nome){
                if(this.lista[i].identificador=="Função"){
                    throw new Error(nome + " já foi declarada como função")
                }else{
                    this.lista[i] = cria_vetor_objeto(nome,array)
                    return;
                }
            }
        }
        this.lista.push(cria_vetor_objeto(nome,array));
    }
    add_Função(nome,args,instruçao){

        let args_length = args.length
        for(let i = 0; i<this.lista.length;i++){

            if(this.lista[i].nome == nome & this.lista[i].nargs==args_length){
                
                throw new Error("Função "+ nome +" já declarada")

            }
            if(this.lista[i].nome == nome & this.lista[i].identificador!="Função" ){
                
                throw new Error(nome +" já existe")

            }
        }
        this.lista.push(create_function_object(nome,args,instruçao));
    }

    get_identificador(nome){

        for(let i=0; i<this.lista.length;i++){
            if(this.lista[i].nome==nome){
                return this.lista[i].identificador;
            }
        }
    }
    get_Variável_valor(nome){
        for(let i=0; i<this.lista.length;i++){
            if(this.lista[i].nome==nome){
                return this.lista[i].valor
            }
        }
    }
    get_vetor_nome(nome){

        for(let i = 0 ; i<this.lista.length ; i++){
            if(this.lista[i].nome==nome){
                return this.lista[i].nome;
            }
        }
    }
    get_vetor_array(nome){

        for(let i = 0 ; i<this.lista.length ; i++){
            if(this.lista[i].nome==nome){
                return this.lista[i].array;
            }
        }
    }
    get_function_args(func,nargs){

        for(let i = 0 ; i < this.lista.length ; i++){
            if(func  == this.lista[i].nome & this.lista[i].nargs==nargs){
                return this.lista[i].args;
            }
        }
    }
    get_function_nargs(func,nargs){

        for(let i = 0 ; i < this.lista.length ; i++){
            if(func  == this.lista[i].nome & this.lista[i].nargs==nargs){
                return this.lista[i].nargs;
            }
        }
    }
    get_function_instruction(func,nargs){

        for(let i = 0 ; i < this.lista.length ; i++){
            if(func  == this.lista[i].nome & this.lista[i].nargs==nargs){
                return this.lista[i].instruçao;
            }
        }
    }
 
}


class operador_list{

    constructor(op_lista){
        this.op_lista = op_lista;
    }
    get_operador_precedence(operador){

        for(let i=0; i<this.op_lista.length ; i++){
            if(operador==this.op_lista[i].token){
                return this.op_lista[i].precedencia;
            }
        }
        return 0;
    }
    get_operador_associativity(operador){

        for(let i=0; i<this.op_lista.length ; i++){
            if(operador==this.op_lista[i].token){
                return this.op_lista[i].associatividade;
            }
        }
    }
    get_operador_token(token){

        for(let i=0; i<this.op_lista.length ; i++){
            if(token==this.op_lista[i].token){
                return this.op_lista[i].token;
            }
         }
    }
    get_operador_type(operador){

        for(let  i=0 ; i<this.op_lista.length ; i++){

                if(this.op_lista[i].token == operador){
                
                return this.op_lista[i].tipo;
                }
        }
    }
    
}

function cria_var_objeto(nome,valor){

        let Variável = {nome,valor,identificador:"Variável"};
        return Variável;

}
function cria_vetor_objeto(nome,array){
    let vetor = {nome,array,identificador:"Vetor",length:array.length};
    return vetor;
}
function create_function_object(nome,args,instruçao){

    let func = {nome,args,nargs:args.length,instruçao,identificador:"Função"};
    return func;

}
function create_operador_objeto(token,precedencia,associatividade,tipo){
    
    let operador = {token,precedencia,associatividade,tipo};

    return operador;

}
function create_operador_list(){
    
    let op_lista=[];
    op_lista.push(create_operador_objeto("+",2,"left","binary")); 
    op_lista.push(create_operador_objeto("-",2,"left","binary"))
    op_lista.push(create_operador_objeto("*",3,"left","binary"))
    op_lista.push(create_operador_objeto("/",3,"left","binary"))
    op_lista.push(create_operador_objeto("^",5,"right","binary"))
    op_lista.push(create_operador_objeto("'",6,"right","unary"))
    op_lista.push(create_operador_objeto("%",4,"left","binary"))
    op_lista.push(create_operador_objeto("&",4,"left","binary"))
    op_lista.push(create_operador_objeto("~",4,"right","unary"))
    op_lista.push(create_operador_objeto("!",4,"right","unary"))
    return new operador_list(op_lista);

}         

function cria_func_list(){

    let lista = []
    lista.push(create_function_object("mult",["a","b"],['return','a','*','b']))
    lista.push(create_function_object("soma",["a","b"],['return', 'a','+','b']))
    lista.push(create_function_object("subt",["a","b"],['return', 'a','-','b']))

    return lista;

}
function copy_array(array1,array2,pos=0){
  
    for(let i=0; i<array2.length; i++){
        array2.pop();
    }
    for(let i=pos ; i<array1.length; i++){
        array2.push(array1[i]);
    }
    return array2;
}

function tokenize(array){
    return array.match(/([A-Za-z0-9]+)|(".*[\n]*.*")|('.*[\n]*.*')|(\.){3,3}|(\n)|(\S)/g)
}

function Missing_parenthese_error(array,pos,type){
    let error_array = []
    let error_msg;
    let String =  array.join("");
    if(type==1){
            error_msg = "Missing parenthese: "
    }
    if(type==2){

         error_msg = "Missing parenthese after function call: "
    }
    for(let i = 0; i<error_msg.length + String.length + 1; i++){
        
        
        if(i==(error_msg.length + pos + String.length - array.length)){
            
            error_array[i-4]="^"
            error_array[i-3]="^"
            error_array[i-2]="^"
            error_array[i-1]="^"
            error_array[i]="^"
            error_array[i+1]="^"
            error_array[i+2]="^"
            error_array[i+3]="^"
            error_array[i+4]="^"
           
            break;

        }
        error_array.push(" ")
    }
    if(type==1){
        throw new Error("\n"+ error_msg + String +"\n"+error_array.join(""));
    }
    if(type==2){
        throw new Error("\n"+ error_msg  + String + "\n" + error_array.join(""));
    }
}

function NãoInteiroError(mensagem){

    this.name = "NãoInteiroError";
    this.mensagem = mensagem;
    this.stack = (new Error()).stack;
}
NãoInteiroError.prototype=Object.create(NãoInteiroError.prototype);
NãoInteiroError.prototype.constructor = NãoInteiroError;
function Termo_inesperado(array,linha,pos){
    let error_array = []
    let error_msg;
    error_msg = "Termo inesperado: "
    let dif = linha.length - array.length;
    for(let i = 0; i<error_msg.length + linha.length + 1; i++){
        
        
        if(i==(error_msg.length + pos + dif)){
            
            error_array[i-4]="^"
            error_array[i-3]="^"
            error_array[i-2]="^"
            error_array[i-1]="^"
            error_array[i]="^"
            error_array[i+1]="^"
            error_array[i+2]="^"
            error_array[i+3]="^"
            error_array[i+4]="^"
           
            break;

        }
        error_array.push(" ")
    }
    throw new SyntaxError("\n" + error_msg + linha.join("") + "\n" + error_array.join(""))
}
function Main(){
    
    let cod_vetor=[];
    let cod_pos= [];
    let array_linha = [];
    let operador_list = create_operador_list();
    let lista = cria_func_list();
    let armaz = new armazenamento(lista);
    let expression ="((90-10)+(+(100+30*20+10*-30+0-40)+3%2*3^4)*5)+&20*4"
    //operador & criei só pra mostrar q da pra fazer qualquer magia aqui , no caso o & add 1000 no numero da frente(((90-10)*(100*20-300)-40)+3%2*3^4*5+1020). Com isso ja da pra criar expressão Booleana facilmente.
    
    function identify(term){

        if(term==undefined){
         return undefined;
        }
        if(term == "("){
            return "(";
        }
        if(term == ")"){
            return ")";
        }
        if(term == "["){
            return "[";
        }
        if(term == "]"){
            return "]";
        }
        if(term=="si"){

            return "Bool";
        }
        if(term=="no"){

            return "Bool";
        }

        if(armaz.get_identificador(term)=="Vetor" | Array.isArray(term)){

            return "Vetor";
        }
        
        if(parseInt(term) | term=="0" | parseInt(term)==0){
            if(Number.isInteger(parseFloat(term)) | term=="0"){
                return "Inteiro"
            }
            else{
                throw new NãoInteiroError("Número não-inteiro detectado!");
            }
        }
        if(term.match(/(".*[\n].*")|('.*[\n].*')/)){

            return "String";

        }
        if(operador_list.get_operador_token(term)){
            return "operador";
        }
        if(armaz.get_identificador(term)=="Função"){
            return "Função";
        }
        if(armaz.get_identificador(term)=="Variável"){
            return "Variável";
        }
    }
    function NãoInteiroError(mensagem){

        this.name = "NãoInteiroError";
        this.mensagem = mensagem;
        this.stack = (new Error()).stack;
    }
    NãoInteiroError.prototype=Object.create(NãoInteiroError.prototype);
    NãoInteiroError.prototype.constructor = NãoInteiroError;
    function Unexpected_token_error(array,pos){
        

        identificador = identify(array[pos]);
        if(identificador){
            throw new SyntaxError( identificador + " inesperado em "+"\x1b[34m>>>>>> \x1b[0m" + cod_vetor[cod_pos[1]].join("")+"\x1b[34m <<<<<<\x1b[0m")
        }
        if((/^[A-Za-z]([A-Za-z0-9_])*$/).test(array[pos])){
            if(array[pos+1]=="("){
                array.splice(pos,0,"\x1b[30m>>>>>>>>>>>>\x1b[0m");
                array.splice(pos+2,0,"\x1b[30m<<<<<<<<<<<<\x1b[0m");
                throw new ReferenceError("Function "+ array[pos+1] + " not declared: " + array.join(""))
            }
            throw new SyntaxError( "Variável não declarada em "+"\x1b[34m>>>>>> \x1b[0m" + cod_vetor[cod_pos[1]].join("")+"\x1b[34m <<<<<<\x1b[0m")
        }
        
        array.splice(pos,0,"\x1b[30m>>>>>>>>>>>>\x1b[0m");
        array.splice(pos+2,0,"\x1b[30m<<<<<<<<<<<<\x1b[0m");
        throw new SyntaxError("Token Inesperado em:" +"\x1b[34m>>>>>> \x1b[0m" + cod_vetor[cod_pos[1]].join("")+"\x1b[34m <<<<<<\x1b[0m");
    }
    
    function vetor_decl(array,cod_pos){

            cod_pos[0]++;
            let pt_count = 0
            let termos = [];
            let todo_array = [];
            let error_pos = [] ;
            for(cod_pos[0] ;cod_pos[0]<array.length; cod_pos[0]++){

                if(array[cod_pos[0]]){

                    
                    if(array[cod_pos[0]]=="," && pt_count==0){

                        if(termos[0]){
                            error_pos[0] = cod_pos[0] - termos.length;
                            todo_array.push(solve_expression(termos,error_pos));
                            termos=[];
                        }
                        else{
                            throw new SyntaxError("Algo é esperado entre as virgulas em: " + cod_vetor[cod_pos[1]].join(""));
                        }
                    }
            
                    else if(array[cod_pos[0]]=="]"){
                        error_pos[0] = cod_pos[0]- termos.length;
                        todo_array.push(solve_expression(termos,error_pos));
                        break;    

                    }
                    else if(array[cod_pos[0]]=="["){

                        todo_array.push(vetor_decl(array,cod_pos))
                        if(array[cod_pos[0]]=="]"){
                            break;
                        }
                        if(array[cod_pos[0]]!=","){
                            Unexpected_token_error(array,cod_pos[0])
                        }

                    }
                    
                    else{ 

                        if(array[cod_pos[0]]=="("){
                            pt_count++;
                        }
                        else if(array[cod_pos[0]]==")"){
                            pt_count--;
                        }
                        termos.push(array[cod_pos[0]])

                    }
                }
                else{
                    throw new SyntaxError("Um vetor é esperado depois de abrir chaves.")
                }
            }
           if(cod_pos[0]==array.length){

                throw new SyntaxError("Esqueceu de fechar chaves em:" + array.join(""));
            }

            else{
                cod_pos[0]++
                return todo_array;
            
            }
        
         
    }

    
    function cria_var(linha,pos){
        
        
        let valor;
        let variaveis = [];
        for(pos;pos<linha.length;pos++){

            if((/^[A-Za-z]([A-Za-z0-9_])*$/).test(linha[pos])){

                if(linha[++pos]){

                    if((linha[pos]=="=" | linha[pos]==",") & linha[pos+1]!=undefined){

                        if(linha[pos]==","){
                        
                            variaveis.push(linha[pos-1]);

                        }

                        else if(linha[pos]=="="){
                            variaveis.push(linha[pos-1]);
                            if(linha[++pos]=="["){

                                cod_pos[0] = pos;
                                valor = vetor_decl(linha,cod_pos);

                            }
                            else{

                                valor =  expression_handling(linha,pos);

                            }
                            break;
                        }
                        else if(linha[pos]=="["){
                            cod_pos[0]=pos;
                            let elemento = get_elemento_array(linha,cod_pos);
                        }
                        
                        else{
                            throw new Error ("Algo é esperado depois de "+ linha[pos]);
                        } 
                    }
                    else{
                        Termo_inesperado(linha,cod_vetor[cod_pos[1]],pos)
                    }
                }
                else{

                variaveis.push[pos-1];

                }
            }
            else{
                Unexpected_token_error(linha,pos)
            }
        }
        

        if(Array.isArray(valor)){

            for(let i=0 ; i<variaveis.length; i++){
                
                armaz.add_vetor(variaveis[i],valor);

            }
        }
        else{

            for(let i=0 ; i<variaveis.length; i++){
                
                armaz.add_var(variaveis[i],valor);

            }
        } 

    }
    function cria_Função(line,pos) {

        
        if(line[pos]=="("){
            pos++
            let args= [];
            let nome=line[0];
            for(pos;pos<line.length;pos++){

                if(line[pos]){
                    if((/^[A-Za-z]([A-Za-z0-9_])*$/).test(line[pos])){
                        //argument match type not operador , bracers , etc
                        if(line[pos+1]==")"){

                            args.push(line[pos++])
                            break;
                        }
                        else if(line[pos+1]==","){

                            args.push(line[pos++])

                        }
                        else {
                            throw new SyntaxError("Argumento inválido para a declaração da função: " + nome)
                        }
                    }  
                    else{
                        throw new SyntaxError("Argumento inválido para a função " + nome)
                    }
                    
                }
                else{
                    throw new SyntaxError("Espera-se um argumento depois da função " + nome)
                }
                
            }
            if(line[pos]!=")"){
                throw new SyntaxError("Espera-se fechar parentese depois do argumento da função: "+ nome)
            }
            else{
                if(line[++pos]=="="){

                
                    if(line[++pos]=="{"){

                        let instruçao=[]
                        for(++pos;pos<line.length-1;pos++){

                            if(line[pos]=="}"){

                                throw new SyntaxError("Unexpected end of function")

                            }
                            instruçao.push(line[pos]);

                        }
                        if(line[pos++]=="}"){
                            
                            armaz.add_Função(nome,args,instruçao)
                        }
                        else{
                            throw new SyntaxError("Esperando fechar chaves depos de declarar a função " + nome)
                        }
                    }
                    else{
                        throw new SyntaxError("Esperando abertura de chaves depois de declarar função"+ nome)
                    }
                }
                else{

                    throw new SyntaxError("Faltando" + "'='" + "depois da linha de argumento: "+ nome)
                }
        
            }      
        }
        else{
            let identifier = identify(line[1]);
            if(identifier){
                throw new SyntaxError("Unexpected " + identifier+ ": " + line[1]);
            }
            else{
                throw new SyntaxError("Unexpected token" + line[1] )
            }
        }
        
    }
    //     else{
    //         let identifier = identify(line[1]);
    //         if(identifier){
    //             throw new SyntaxError("Unexpected " + identifier+ ": " + line[1]);
    //         }
    //         else{
    //             throw new SyntaxError("Unexpected token" + line[1] )
    //         }
    //     }
    // }
    // else{
    //     throw SyntaxError("Expecting something after function declaration "+ line[1])
    // }

    
    function reduce_function(args_value,args,instruction,name){
        
        let instruc_array =[];
        copy_array(instruction,instruc_array);
        for(let i = 0 ; i< instruc_array.length ; i++){
            for(let j = 0 ; j < args.length ; j++){
    
                if(instruc_array[i]==args[j]){
                    instruc_array.splice(i,1,args_value[j]);
                    break;
                }
    
            }
        }
        
            if(instruc_array.length!=0){

                this_pos = []
                this_pos[0] = 0
                try{
                    return solve_expression(instruc_array,this_pos)
                }
                catch(e){
                    if(e instanceof SyntaxError){
                        Unexpected_token_error(instruction,this_pos[0]+1)
                   }
                    else if(e instanceof Error){
                         Missing_parenthese_error(instruction,this_pos[0]+1,1)
                     }
                     else if(e instanceof ReferenceError){
                        Unexpected_token_error(instruction,this_pos[0]+1)
                    }
                     else if(e instanceof NãoInteiroError){
                         console.log("\x1b[31m" + e.mensagem + "\x1b[0m");
                     }
                }
            }
            else{
                return undefined;
            }
    }
    function solve_function(array,pos_atual){
        
        let j;
        let args_array=[];
        let args_value =[];
        let arg_array=[];
        let pt_count = -1;
        let name = array[0];
        let pos;
        pos_atual[0]++
        if (array[1]!="("){

            Missing_parenthese_error(array,pos_atual[0],2)
            

        }
        for(pos=2; pos<array.length; pos++){

            
            if(array[pos]=="("){
                pt_count--;
            }
            if (array[pos]==")"){
                pt_count++;
                if(pt_count==0){
                    if(arg_array.length){

                        args_array.push(arg_array)
                        pos_atual[0]++;

                    }
                    else{
                        throw new Error ("Missing parameters for function: "+ name + ": " + array.join(""))
                    }
                    break;
                }
        
            }
            if(array[pos]=="," & pt_count==-1){
                if(arg_array.length){
                    args_array.push(arg_array)
                    arg_array = [];
                }
                else{
                    throw new Error ("Missing parameters for function: "+ name +": " + array.join(""))
                }
            }
            if(array[pos]!="," | pt_count!=-1){

             arg_array.push(array[pos]);

            }
        }
        
        if(pos==array.length){

            Missing_parenthese_error(array_linha,pos_atual[0],1)

        }
        if(args_array.length == armaz.get_function_nargs(name,args_array.length)){
            let instruction = armaz.get_function_instruction(name,args_array.length); 
            let args = armaz.get_function_args(name,args_array.length);
            for(let i = 0; i<args_array.length; i++){
                args_value.push(solve_expression(args_array[i],pos_atual))
                pos_atual[0]++;
            }
           return [reduce_function(args_value,args,instruction,name),pos]
        }
        else{
            throw new SyntaxError("Número de argumentos errados para a função " + name + ": " + cod_vetor[cod_pos[1]].join(""))
        }
    }
    function reduce_expression(operador,token1,token2){

        let identifier1 = identify(token1); 
        let identifier2 =  identify(token2);
       
    
        if(identifier1=="Inteiro"){
            
            if(identifier2==undefined){
                token1 = parseInt(token1);
                switch(operador){
    
                    case "'":
                        return -token1;
                }
            }
            else if(identifier2=="Inteiro"){
                token1  = parseInt(token1);
                token2 = parseInt(token2);
                switch (operador){
    
                    case "+":
                    return token1+token2
                    case "-":
                    return token1-token2
                    case "*":
                    return token2*token1;
                    case "/":
                    return token2/token1;
                    case "^":
                    return Math.pow(token1,token2);
                    case "%":
                    return token1%token2;
                    case "&":
                    return token2 & token1; 
                    case "|":
                    return token2 | token1; 
                }
            }
            else{
                throw new SyntaxError("Operação " + operador
            + " com " + identifier1 + " e " + identifier2 + " inválida." )
            }       
        }
        else{
            throw new SyntaxError("Operação " + operador
        + " com " + identifier1 + " e " + identifier2 + " inválida." )
        }
    
    }
    function verifyExpressionSyntax(exp_array,pos_atual){

        let pt_count = 0;
        let identifier;
        for(let i=0;i<exp_array.length;i++){
            
            identifier = identify(exp_array[i]);
            
            if(exp_array[i]=="("){
                 
                pt_count++;
                i++;
                pos_atual[0]++;
                identifier = identify(exp_array[i]);
                if(exp_array[i]=="("){
                    i--;
                    
                }
                else if(exp_array[i]=="-" | exp_array[i]=="+"){

                    i--
                   
               
                }
                else if(identifier=="Inteiro" | identifier=="Variável" | identifier=="Função" | identifier=="Bool" | identifier=="String" | identifier=="Vetor" | identifier=="["){

                   i--
                  

                }
                else{
                    Unexpected_token_error(array_linha,pos_atual[0]);
                }
            }
            else if((exp_array[i-1]!=exp_array[i]) & (exp_array[i]=="-" | exp_array[i]=="+" | operador_list.get_operador_type(exp_array[i])=="unary")){

                i++;
                pos_atual[0]++;
                identifier = identify(exp_array[i]);
                if(identifier=="Inteiro" | identifier=="Variável" | identifier=="Função" | identifier=="Bool" | identifier=="String"  | identifier=="Vetor" | identifier=="Vetor_js" | identifier=="["){

                    i--
                    

                }
                else if(identifier=="("){
                    i--;
                    
                   
                }
                else{
                    Unexpected_token_error(array_linha,pos_atual[0]);
                }
                
            }
            else if(identifier=="Inteiro" | identifier=="Variável" | identifier=="Função" | identifier=="Bool" | identifier=="String"  | identifier=="Vetor" | identifier=="["){

                if(identifier =="Inteiro"){
                    pos_atual[0]++;
                }
                else if(identifier=="Variável"){

                    exp_array[i]= armaz.get_Variável_valor(exp_array[i]);
                    pos_atual[0]++;
                    
                }
                else if(identifier =="Função"){
                    
                    let func_array = exp_array.slice(i,exp_array.length);
                    let [result,Função_size] = solve_function(func_array,pos_atual);
                    exp_array.splice(i,Função_size+1,result);

                }
                else if(identifier=="Vetor"){
                    if(Array.isArray(exp_array[i])){
                    }
                    else{
                        exp_array[i]= armaz.get_vetor_array(exp_array[i])
                    }
                    pos_atual[0]++;
                }
                else if(identifier=="["){
                   let pos_anterior =  pos_atual[0]
                   let vetor = vetor_decl(array_linha,pos_atual);
                   exp_array.splice(i,pos_atual[0]-pos_anterior,vetor);

                }
                  
                i++
                identifier = identify(exp_array[i])
                if(i==exp_array.length){

                    break;

                }
                else if(identifier=="["){
                   
                    pos_atual[0]++;                       
                    identifier = identify(exp_array[++i]);
                    if((identifier=="Inteiro" | identifier=="Variável") & identify(exp_array[++i])=="]"){
                        pos_atual[0]++;
                        if(identifier=="Variável"){
                            exp_array[i-1]=armaz.get_Variável_valor(exp_array[i-1]);
                        }
                        let pos = exp_array[i-1];
                        //colocar para string tmb
                        if(identify(exp_array[i-3])=="Vetor"){

                            if(Array.isArray(exp_array[i-3])){
                                    exp_array.splice(i-3,4,exp_array[i-3][pos])
                            }
                            else{
                                exp_array.splice(i-3,4,get_vetor_array(exp_array[i-3])[pos])
                            }
                            i=i-4;
                            if(exp_array[i+1]==undefined){
                                throw new SyntaxError("posição " + pos + " do Vetor não definida")
                            }
                        }
                        else{
                            throw new SyntaxError("Não é possivel ler a posição "+ pos +" de "  + identify(exp_array[i-3]))
                        }

                    }
                    else{
                        throw new SyntaxError("Abertura de chaves inválida em: " + cod_vetor[cod_pos[1]].join(""))
                    }
                   
                }
                else if(identifier=="operador"){

                    pos_atual[0]++;

                }
                else if(exp_array[i]==")"){
                    
                    while(exp_array[i]==")"){
                        
                        pt_count--;
                        i++
                        pos_atual[0]++;
                    }
                    if((identify(exp_array[i])=="operador" & i+1!=exp_array.length) | i == exp_array.length){

                        pos_atual[0]++;
                    }
                    else{
                        Unexpected_token_error(array_linha,pos_atual[0]);
                    }
                }
                else{
                    Unexpected_token_error(array_linha,pos_atual[0]);
                }

            }

            else{
                Unexpected_token_error(array_linha,pos_atual[0],1);
            }
            
        }
        if(pt_count!=0){
            Missing_parenthese_error(array_linha,pos_atual[0],1)
        }
        return true;
    }
    function RPN(expression_array){
    
        let operador_stack = [];
        let output = [];
        let identifier;
        let token;
        for(let i = 0 ; i <expression_array.length; i++ ){
          
          token = expression_array[i];
          identifier = identify(token);

           if(token=="-" & (identify(expression_array[i-1])=="operador"|expression_array[i-1]=="(" | expression_array[i-1]==undefined))
            {
              expression_array.splice(i,1,"'")
              token = "'";
            }
          //no caso do 10--10 para ele reconhecer como unario o segundo menos e inverter o sinal do numero eu na hora de montar ele tenho que mudar o "-" que é unário por " ' ", a negação de discreta , porque desse modo eu consigo diferenciar na hora de resolver se ele é o operador unário ou o operador de subtração. 
          if(token=="+" & (identify(expression_array[i-1])=="operador"|expression_array[i-1]=="(" | expression_array[i-1]==undefined))
            {
              expression_array.splice(i,1,)
              token = expression_array[i];
              identifier =  identify(token);
            }
      // caso de 10+++10 , eu não faço nada além deletar os + que não são operadores e no final obtenho 10+10 normalmente.
          if(identifier=="Inteiro"| identifier=="Bool" | identifier=="String" | identifier=="Vetor"){
            output.push(token);
          }
          else if(identifier=="operador"){
            let stack_top = operador_stack[operador_stack.length-1];
            while((stack_top!=undefined) & ( operador_list.get_operador_precedence(stack_top)>operador_list.get_operador_precedence(token)
                                          | (operador_list.get_operador_precedence(stack_top)==operador_list.get_operador_precedence(token) & operador_list.get_operador_associativity(token)=="left"))
                                           & (stack_top!="(")){
                 
                 output.push(operador_stack.pop());
                 stack_top = operador_stack[operador_stack.length-1];
            }
            
            operador_stack.push(token);
          }
    
          else if(token=="("){
            operador_stack.push(token);
          }
          else if(token ==")"){
            let stack_top = operador_stack[operador_stack.length-1];
            while(stack_top!="("){
              output.push(operador_stack.pop());
              stack_top = operador_stack[operador_stack.length-1];
          }
            if(stack_top=="("){
              operador_stack.pop();
            }
          }  
        }
        for(let i=0;i<operador_stack.length;i++){
         if(identify(operador_stack[i])=="operador"){
            output.push(operador_stack.pop())
            i--;
          }
        }
        return output;
      } //passa pra reversed polish
    function solve_RPN(RPN_array){
        let result=0;
        let token2;
        let pos=0;
        while(RPN_array.length!=1){
        
          
          while(identify(RPN_array[pos])!="operador"){
            result = RPN_array[pos-1];
            token2 = RPN_array[pos++];
            }
         
          if(operador_list.get_operador_type(RPN_array[pos])=="binary"){
            result = reduce_expression(RPN_array[pos],result,token2);
            RPN_array.splice(pos-2,3,result)
            pos = pos -2;
          }
         else{
            result = reduce_expression(RPN_array[pos],token2,undefined);
           RPN_array.splice(pos-1,2,result)
           pos = pos - 1;
         }
         result = RPN_array[pos-1];
         token2 = RPN_array[pos++];
         
        }
       return parseInt(RPN_array[0]); 
      } //resolve a expressão em reversed polish -> salvo dois numeros sempre e quando chega em um operador eu resolvo os dois numeros para o operador e depois removo os dois numeros que foram executados tal como operador , caso o operador seja unario eu só altero o ultimo numero e o operador, por exemplo , 10+&10, vou operar o segundo numero somando 1000 nele, ou seja 10+1010.
    
    function solve_expression(expression_array,pos_atual){

            verifyExpressionSyntax(expression_array,pos_atual);
            return solve_RPN(RPN(expression_array));
        
    }
    function expression_handling(array_linha,pos_atual=0){
    
        let expression_array = array_linha.slice( pos_atual,array_linha.length);
        console.log(expression_array)
        cod_pos[0] = pos_atual;
        if(expression_array[0]){
            return solve_expression(expression_array,cod_pos);
        }
        else{
            throw new SyntaxError("Expressão esperarada");
        }

    }
    function read_line(essa_linha){

       cod_pos[0]=0
       array_linha = essa_linha;
       identifier = identify(array_linha[0]);

    
       if((/^[A-Za-z]([A-Za-z0-9_])*$/).test(array_linha[cod_pos[0]])){

            if(array_linha[++cod_pos[0]]=="("){
                cria_Função(array_linha,cod_pos[0])
            } 
            else{
                cria_var(array_linha,cod_pos[0]-1)
            }

       }
       else {
           Unexpected_token_error(array_linha,0)
       }
    
    }
    function formata(código){
        
        código = tokenize(código);
        comentario = false;
        let linha = [];
        let formatação = [];
        for(let i=0;i<código.length;i++){
            if(código[i]=="..."){
                comentario = !comentario;
            }
            else if(código[i]=="\n" & !comentario ){

                if(linha.length!=0){
                    if(linha[i-1]==";"){
                        linha.pop();
                    }
                    formatação.push(linha);
                    linha = [];
                }
                else{

                }
            }
            else if(!comentario){
                linha.push(código[i]);
            }
            else{
                
            }
        }
        formatação.push(linha);
        return formatação;

    }
    function compila(código){


         cod_vetor = formata(código);
         for(cod_pos[1] = 0 ;cod_pos[1]<cod_vetor.length;cod_pos[1]++){

            read_line(cod_vetor[cod_pos[1]]);

         }

    }
     //resolve a expressão em reversed polish -> salvo dois numeros sempre e quando chega em um operador eu resolvo os dois numeros para o operador e depois removo os dois numeros que foram executados tal como o operador , caso o operador seja unario eu só altero o ultimo numero e o operador, por exemplo , 10+&10, vou operar o segundo numero somando 1000 nele, ou seja 10+1010.
       

//    console.log(read_line("a(a)={return square(2)+200*a*50}"))
//    console.log(read_line("b=a(2)"))
//    console.log(read_line("b,c = square(2)*+5"))
    //  let linha = "square(a)={return (a+b)^2}"
    // read_line(linha);
    // let linha1 = "fnova(a,b)={return square(a)+b}"
    // read_line(linha1);
    //  let linha2 = "b = square(3)";
    //  console.log(read_line(linha2));
    // // console.log(armaz)
    let cod = "a=7\nb=(2+3)\nsquare(a,b,c)={(a+b+c)^2}\nc=square(2,4,2)\nv=[2,3]" 

    compila(cod);
    console.log(armaz.get_vetor_array("v"));
    
}

Main()
