class Functions{

    constructor(list){
        this.list = list
    }
    add_function(name,args,instruction){

        this.list.push(create_function_object(name,args,instruction));
        
    }
    get_function_args(func){

        for(let i = 0 ; i < this.list.length ; i++){
            if(func  == this.list[i].name){
                return this.list[i].args;
            }
        }
    }
    get_function_nargs(func){

        for(let i = 0 ; i < this.list.length ; i++){
            if(func  == this.list[i].name){
                return this.list[i].nargs;
            }
        }
    }
    get_function_instruction(func){

        for(let i = 0 ; i < this.list.length ; i++){
            if(func  == this.list[i].name){
                return this.list[i].instruction;
            }
        }
    }
    get_function_name(func){

        for(let i = 0 ; i < this.list.length ; i++){
            if(func  == this.list[i].name){
                return this.list[i].name;
            }
        }
    }
    
}
class operator_list{

    constructor(op_list){
        this.op_list = op_list;
    }
    get_operator_precedence(operator){

        for(let i=0; i<this.op_list.length ; i++){
            if(operator==this.op_list[i].token){
                return this.op_list[i].precedence;
            }
        }
        return 0;
    }
    get_operator_associativity(operator){

        for(let i=0; i<this.op_list.length ; i++){
            if(operator==this.op_list[i].token){
                return this.op_list[i].associativity;
            }
        }
    }
    get_operator_token(token){

        for(let i=0; i<this.op_list.length ; i++){
            if(token==this.op_list[i].token){
                return this.op_list[i].token;
            }
         }
    }
    get_operator_type(operator){

        for(let  i=0 ; i<this.op_list.length ; i++){

                if(this.op_list[i].token == operator){
                
                return this.op_list[i].type;
                }
        }
    }
    
}
function create_function_object(name,args,instruction){

    let func = {name:"",args:"",nargs:"",instruction:""};
    func.name = name;
    func.args = args;
    func.nargs = args.length;
    func.instruction = instruction;
    return func;

}
function create_operator_object(token,precedence,associativity,type){
    
    let operator = {token:"",precedence:"",associativity:"",type:""};
    operator.token = token;
    operator.precedence = precedence;
    operator.associativity = associativity;
    operator.type = type;
    return operator;

}
function create_operator_list(){
    
    let op_list=[];
    op_list.push(create_operator_object("+",2,"left","binary"));
    op_list.push(create_operator_object("-",2,"left","binary"))
    op_list.push(create_operator_object("*",3,"left","binary"))
    op_list.push(create_operator_object("/",3,"left","binary"))
    op_list.push(create_operator_object("^",5,"right","binary"))
    op_list.push(create_operator_object("'",5,"right","unary"))
    op_list.push(create_operator_object("%",4,"left","binary"))
    op_list.push(create_operator_object("&",4,"left","binary"))
    op_list.push(create_operator_object("~",4,"right","unary"))
    op_list.push(create_operator_object("!",4,"right","unary"))
    return new operator_list(op_list);

}         

function create_functions(){

    let func_list = []
    func_list.push(create_function_object("mult",["a","b"],['return','a','*','b']))
    func_list.push(create_function_object("soma",["a","b"],['return', 'a','+','b']))
    func_list.push(create_function_object("subt",["a","b"],['return', 'a','-','b']))
    return new Functions(func_list);

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

function reduce_expression(number1,number2,operator){


switch (operator){

    case "+":
    return number1+number2
    case "-":
    return number1-number2
    case "*":
    return number2*number1;
    case "/":
    return number2/number1;
    case "^":
    return Math.pow(number1,number2);
    case "'":
    return -number2;
    case "%":
    return number1%number2;
    case "&":
    return number2 & number1; 
    case "|":
    return number2 | number1; 
}

}
function tokenize(array){
    return array.match(/[0-9]+|[A-Za-z0-9]+|\S/g)
}
function Unexpected_token_error(array,pos){


    if((/^[A-Za-z]([A-Za-z0-9_])*$/).test(array[pos])){
        if(array[pos+1]=="("){
            array.splice(pos,0,"\x1b[30m>>>>>>>>>>>>\x1b[0m");
            array.splice(pos+2,0,"\x1b[30m<<<<<<<<<<<<\x1b[0m");
            throw new ReferenceError("Function "+ array[pos+1] + " not declared: " + array.join(""))
        }
        array.splice(pos,0,"\x1b[30m>>>>>>>>>>>>\x1b[0m");
        array.splice(pos+2,0,"\x1b[30m<<<<<<<<<<<<\x1b[0m");
        throw new ReferenceError("Variable not declared: " + array.join(""))
    }
    array.splice(pos,0,"\x1b[30m>>>>>>>>>>>>\x1b[0m");
    array.splice(pos+2,0,"\x1b[30m<<<<<<<<<<<<\x1b[0m");
    throw new SyntaxError("Unexpected token :" + array.join(""));
}
function Missing_parenthese_error(array,pos,type){
    let error_array = []
    let error_msg;
    let string =  array.join("");
    if(type==1){
            error_msg = "Missing parenthese: "
    }
    if(type==2){

         error_msg = "Missing parenthese after function call: "
    }
    for(let i = 0; i<error_msg.length + string.length + 1; i++){
        
        
        if(i==(error_msg.length + pos + string.length - array.length)){
            
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
        throw new Error("\n"+ error_msg + string +"\n"+error_array.join(""));
    }
    if(type==2){
        throw new Error("\n"+ error_msg  + string + "\n" + error_array.join(""));
    }
}
function Main(){

    let line_array = [];
    let operator_list = create_operator_list();
    let functions = create_functions();
    let expression ="((90-10)+(+(100+30*20+10*-30+0-40)+3%2*3^4)*5)+&20*4"
    //operador & criei só pra mostrar q da pra fazer qualquer magia aqui , no caso o & add 1000 no numero da frente(((90-10)*(100*20-300)-40)+3%2*3^4*5+1020). Com isso ja da pra criar expressão booleana facilmente.
    
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
        if(term=="true"){
            return "bool"
        }
        if(term=="false"){
            return "bool"
        }
        if(parseInt(term) | term=="0"){
            return "integer";
        }
        if(term.match(/^(".*")|('.*')$/)){

            return "string";

        }
        if(operator_list.get_operator_token(term)){
            return "operator";
        }
        if(functions.get_function_name(term)){
            return "function";
        }
    }
    function function_creator(line) {

        if(line[1])

            if((/^[A-Za-z]([A-Za-z0-9_])*$/).test(line[1])){
                
                if(line[2]=="("){
        
                    let args = []
                    let pos=0;
                    for(pos=3;pos<line.length;pos++){

                        if(line[pos]){
                            if((/^[A-Za-z]([A-Za-z0-9_])*$/).test(line[pos])){
                                //argument match type not operator , bracers , etc
                                if(line[pos+1]==")"){

                                    args.push(line[pos++])
                                    break;
                                }
                                else if(line[pos+1]==","){
            
                                    args.push(line[pos++])
            
                                }
                                else {
                                    throw new SyntaxError("Invalid argument line declaration for function " + line[1])
                                }
                            }  
                            else{
                                throw new SyntaxError("Invalid argument declaration for function " + line[1])
                            }
                            
                        }
                        else{
                            throw new SyntaxError("Expecting argument after function " + line[1] + " parentheses opening")
                        }
                        
                    }
                    if(line[pos]!=")"){
                        throw new SyntaxError("Expect close parentheses after function argument: ")
                    }
                    else{
                        if(line[++pos]=="="){

                        
                            if(line[++pos]=="{"){
            
                                let instruction=[]
                                for(++pos;pos<line.length-1;pos++){
            
                                    if(line[pos]=="}"){
            
                                        throw new SyntaxError("Unexpected end of function")
            
                                    }
                                    instruction.push(line[pos]);
            
                                }
                                if(line[pos++]=="}"){
                                    
                                    functions.add_function(line[1],args,instruction);
                                }
                                else{
                                    throw new SyntaxError("Expect end of function ")
                                }
                            }
                            else{
                                throw new SyntaxError("Expecting bracer opening after function declaration")
                            }
                        }
                        else{

                            throw new SyntaxError("Missing "+"'='"+" after argument line: "+ line[1])
                        }
                    }
        
                }
                else{
                    throw new SyntaxError("Expecting parenthese opening after declaration on function " + line[1] )
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
        else{
            throw SyntaxError("Expecting something after function declaration "+ line[1])
        }
    
    }
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
        if(instruc_array[0]=="return"){

            if(instruc_array[1]){

                instruc_array.shift()
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
                }
            }
            return undefined;
        }
        else{
            throw new SyntaxError("Not a Simple function! "+ name + ": " + instruction)
        }
    }
    function solve_function(array,current_pos){
        
        let j;
        let args_array=[];
        let args_value =[];
        let arg_array=[];
        let pt_count = -1;
        let name = array[0];
        let pos;
        current_pos[0]++
        if (array[1]!="("){

            Missing_parenthese_error(array,current_pos[0],2)
            

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
                        current_pos[0]++;

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

            Missing_parenthese_error(line_array,current_pos[0],1)

        }
        if(args_array.length == functions.get_function_nargs(name)){
            let instruction = functions.get_function_instruction(name); 
            let args = functions.get_function_args(name);
            for(let i = 0; i<args_array.length; i++){
                args_value.push(solve_expression(args_array[i],current_pos))
                current_pos[0]++;
            }
           return [reduce_function(args_value,args,instruction,name),pos]
        }
        else{
            throw new SyntaxError("Wrong argument number for function " + name + ": " + array.join(""))
        }
    }
    function verifyExpressionSyntax(exp_array,current_pos){

        let pt_count = 0;
        let identifier;
        for(let i=0;i<exp_array.length;i++){
            
            identifier = identify(exp_array[i]);
            
            if(exp_array[i]=="("){
                 
                pt_count++;
                i++;
                current_pos[0]++;
                identifier = identify(exp_array[i]);
                if(exp_array[i]=="("){
                    i--;
                    
                }
                else if(exp_array[i]=="-" | exp_array[i]=="+"){

                    i--
                   
               
                }
                else if(identifier=="integer" | identifier=="variable" | identifier=="function" | identifier=="bool" | identifier=="string"){

                   i--
                  

                }
                else{
                    Unexpected_token_error(line_array,current_pos[0]);
                }
            }
            else if((exp_array[i-1]!=exp_array[i]) & (exp_array[i]=="-" | exp_array[i]=="+" | operator_list.get_operator_type(exp_array[i])=="unary")){

                i++;
                current_pos[0]++;
                identifier = identify(exp_array[i]);
                if(identifier=="integer" | identifier=="variable" | identifier=="function" | identifier=="bool" | identifier=="string"){

                    i--
                    

                }
                else if(identifier=="("){
                    i--;
                    
                   
                }
                else{
                    Unexpected_token_error(line_array,current_pos[0]);
                }
                
            }
            else if(identifier=="integer" | identifier=="variable" | identifier=="function" | identifier=="bool" | identifier=="string"){

                if(identifier=="variable"){

                    exp_array[i]= variable.get_value(exp_array[i]);
                    current_pos[0]++;
                    
                }
                else if(identifier =="function"){
                    
                    let func_array = exp_array.slice(i,exp_array.length);
                    let [result,function_size] = solve_function(func_array,current_pos);
                    exp_array.splice(i,function_size+1,result);
                }
                else if(identifier =="integer"){
                    current_pos[0]++;
                }
                  
                i++
                
                if(i==exp_array.length){

                    break;

                }
                else if(identify(exp_array[i])=="operator"){

                    current_pos[0]++;

                }
                else if(exp_array[i]==")"){
                    
                    while(exp_array[i]==")"){
                        
                        pt_count--;
                        i++
                        current_pos[0]++;
                    }
                    if((identify(exp_array[i])=="operator" & i+1!=exp_array.length) | i == exp_array.length){

                        current_pos[0]++;
                    }
                    else{
                        Unexpected_token_error(line_array,current_pos[0]);
                    }
                }
                else{
                    Unexpected_token_error(line_array,current_pos[0]);
                }

            }

            else{
                Unexpected_token_error(line_array,current_pos[0],1);
            }
            
        }
        if(pt_count!=0){
            Missing_parenthese_error(line_array,current_pos[0],1)
        }
        return true;
    }
    function RPN(expression_array){
    
        let operator_stack = [];
        let output = [];
        let identifier;
        let token;
        for(let i = 0 ; i <expression_array.length; i++ ){
          
          token = expression_array[i];
          identifier = identify(token);

           if(token=="-" & (identify(expression_array[i-1])=="operator"|expression_array[i-1]=="(" | expression_array[i-1]==undefined))
            {
              expression_array.splice(i,1,"'")
              token = "'";
            }
          //no caso do 10--10 para ele reconhecer como unario o segundo menos e inverter o sinal do numero eu na hora de montar ele tenho que mudar o "-" que é unário por " ' ", a negação de discreta , porque desse modo eu consigo diferenciar na hora de resolver se ele é o operador unário ou o operador de subtração. 
          if(token=="+" & (identify(expression_array[i-1])=="operator"|expression_array[i-1]=="(" | expression_array[i-1]==undefined))
            {
              expression_array.splice(i,1,)
              i--;
              token = expression_array[i];
              identifier =  identify(expression_array[i])
            }
      // caso de 10+++10 , eu não faço nada além deletar os + que não são operadores e no final obtenho 10+10 normalmente.
          if(identifier=="integer"| identifier=="bool" | identifier=="string"){
            output.push(token);
          }
          else if(identifier=="operator"){
            let stack_top = operator_stack[operator_stack.length-1];
            while((stack_top!=undefined) & ( operator_list.get_operator_precedence(stack_top)>operator_list.get_operator_precedence(token)
                                          | (operator_list.get_operator_precedence(stack_top)==operator_list.get_operator_precedence(token) & operator_list.get_operator_associativity(token)=="left"))
                                           & (stack_top!="(")){
                 
                 output.push(operator_stack.pop());
                 stack_top = operator_stack[operator_stack.length-1];
            }
            
            operator_stack.push(token);
          }
    
          else if(token=="("){
            operator_stack.push(token);
          }
          else if(token ==")"){
            let stack_top = operator_stack[operator_stack.length-1];
            while(stack_top!="("){
              output.push(operator_stack.pop());
              stack_top = operator_stack[operator_stack.length-1];
          }
            if(stack_top=="("){
              operator_stack.pop();
            }
          }  
        }
        for(let i=0;i<operator_stack.length;i++){
         if(identify(operator_stack[i])=="operator"){
            output.push(operator_stack.pop())
            i--;
          }
        }
        return output;
      } //passa pra reversed polish
    function solve_RPN(RPN_array){
        let result=0;
        let number2;
        let pos=0;
        while(RPN_array.length!=1){
        
          
          while(identify(RPN_array[pos])!="operator"){
            result = RPN_array[pos-1];
            number2 = RPN_array[pos++];
            }
         
          result = reduce_expression(parseInt(result,10),parseInt(number2,10),RPN_array[pos])
          
          if(operator_list.get_operator_type(RPN_array[pos])=="binary"){
            RPN_array.splice(pos-2,3,result)
            pos = pos -2;
          }
         else{
           RPN_array.splice(pos-1,2,result)
           pos = pos - 1;
         }
         result = RPN_array[pos-1];
         number2 = RPN_array[pos++];
         
        }
       return parseInt(RPN_array[0]); 
      } //resolve a expressão em reversed polish -> salvo dois numeros sempre e quando chega em um operador eu resolvo os dois numeros para o operador e depois removo os dois numeros que foram executados tal como operador , caso o operador seja unario eu só altero o ultimo numero e o operador, por exemplo , 10+&10, vou operar o segundo numero somando 1000 nele, ou seja 10+1010.
    
    function solve_expression(expression_array,current_pos){

            verifyExpressionSyntax(expression_array,current_pos);
            return solve_RPN(RPN(expression_array));
        
    }
    function expression_handling(line_array,current_pos){
    
        let expression_array = []
        copy_array(line_array,expression_array,current_pos[0]);
        if(expression_array[0]){
            return solve_expression(expression_array,current_pos);
        }
        else{
            throw new SyntaxError("Expression expected");
        }

    }
    function read_line(this_line){

       line_array =  tokenize(this_line);
       current_pos = [];
       current_pos[0] = 0;
       if(line_array){

        if(line_array[0]=="function"){

                function_creator(line_array);
                
            }else{
                return expression_handling(line_array,current_pos)
            }
        }
        else{
            throw new SyntaxError("Empty line");
        }
     
    }
     //resolve a expressão em reversed polish -> salvo dois numeros sempre e quando chega em um operador eu resolvo os dois numeros para o operador e depois removo os dois numeros que foram executados tal como o operador , caso o operador seja unario eu só altero o ultimo numero e o operador, por exemplo , 10+&10, vou operar o segundo numero somando 1000 nele, ou seja 10+1010.
       
    let line1= "function tien(a,b,c)={return ((a+b+c)*2)}"

   read_line(line1);
   current_pos = [];
   current_pos[0] = 0;
   let line2 = "tien(tien(tien(3,2,1),2,tien(3,2,1)),2,2)+10"
   return read_line(line2)
//
}
console.log(Main());
