


class operator{

    constructor(token,precedence=1,associativity,type){
    this.token = token;
    this.precedence = precedence;
    this.associativity = associativity;
    this.type = type;
    }
}

function Create_operator(operators){
    operators.push(new operator("+",2,"left","dunary"));
    operators.push(new operator("-",2,"left","dunary"));
    operators.push(new operator("*",3,"left","dunary"));
    operators.push(new operator("/",3,"left","dunary"));
    operators.push(new operator("^",5,"right","dunary"));
    operators.push(new operator("'",5,"right","unary"));
    operators.push(new operator("%",4,"left","dunary"))
    operators.push(new operator("&",4,"right","unary"))
}

function Main(){
    let operator_list=[];
    let test ;
    Create_operator(operator_list);
    //let expression = "((90-10)*-(100*20+10*-30+0-40)+3%2*3^4*5+&20";
    let expression = "((90-10)*-(100*20+10*-30+0-40))+3%2*3^4*5+&20*4";

    //operador & criei só pra mostrar q da pra fazer qualquer magia aqui , no caso o & add 1000 no numero da frente(((90-10)*(100*20-300)-40)+3%2*3^4*5+1020). Com isso ja da pra criar expressão booleana facilmente.
    let array = expression.match(/[0-9]+|[A-Za-z0-9]+|\S/g);
    function get_precedence(operator_list,operator){
    for(let i=0; i<operator_list.length ; i++){
    if(operator==operator_list[i].token){
        return operator_list[i].precedence;
    }
    }
    return 0;
    }
    function get_associativity(operator_list,operator){
    for(let i=0; i<operator_list.length ; i++){
    if(operator==operator_list[i].token){
        return operator_list[i].associativity;
    }
    }

    }
    function get_operator_token(operator_list,token){
    for(let i=0; i<operator_list.length ; i++){
    if(token==operator_list[i].token){
        return operator_list[i].token;
    }
    }

    }
    function get_operator_type(operator_list,operator){
    for(let  i=0 ; i<operator_list.length ; i++){
        if(operator_list[i].token == operator){
        
        return operator_list[i].type;
        }
    }
    }
    function identify(term){

    if(term==undefined){
    return undefined;
    }
    if(get_operator_token(operator_list,term)){
    return "operator";
    }
    if(term == "("){
    return "(";
    }
    if(term == ")"){
    return ")";
    }
    if(parseInt(term) | term=="0"){
    return "integer";
    }
    console.log(term)
    if(term.match(/^(".*")|('.*')$/)){

    return "string";

    }
    }
    function expressionSyntax(exp_array){

        let pt_count = 0;
        for(let i=0;i<exp_array.length;i++){
            
            if(identify(exp_array[i])=="("){

                pt_count++;
                i++;
                if(identify(exp_array[i])=="("){
                    i--;
                    
                }
                else if(exp_array[i]=="-" | exp_array[i]=="+"){

                    i++;
                    if(identify(exp_array[i])=="integer" | identify(exp_array[i])=="variable" | identify(exp_array[i])=="function"){
                        i++
                        if(i==exp_array.length){

                            break;
        
                        }
                        else if(identify(exp_array[i])=="operator"){
        
                        }
                        else if(exp_array[i]==")"){

                            while(exp_array[i]==")"){
                            pt_count--;
                            i++;
                            }

                        }
                        else{
                            array.splice(i,0,"\x1b[32m>>>>>>>>>>>>\x1b[0m");
                            array.splice(i+2,0,"\x1b[32m<<<<<<<<<<<<\x1b[0m");  
                            throw new SyntaxError("Unexpected token :" + '\x1b[32m%s\x1b[0m', array.join(""));
                        }

                    }

                    else if(identify(exp_array[i]=="(")){
                        i--;
                    }
                    else{
                        array.splice(i,0,"\x1b[32m>>>>>>>>>>>>\x1b[0m");
                        array.splice(i+2,0,"\x1b[32m<<<<<<<<<<<<\x1b[0m");
                        throw new SyntaxError("Unexpected token :" + '\x1b[32m%s\x1b[0m', array.join(""));
                    }

                
                }
                else if(identify(exp_array[i])=="integer" | identify(exp_array[i])=="variable" | identify(exp_array[i])=="function"){

                    i++
                    if(i==exp_array.length){

                        break;
    
                    }
                    else if(identify(exp_array[i])=="operator"){

        
                    }
                    else if(exp_array[i]==")"){
                        
                        while(identify(exp_array[i])==")"){
                        pt_count--;
                        i++
                        }
                    }
                    
                    else{
                        array.splice(i,0,"\x1b[32m>>>>>>>>>>>>\x1b[0m");
                        array.splice(i+2,0,"\x1b[32m<<<<<<<<<<<<\x1b[0m");
                        throw new SyntaxError("Unexpected token :" + array.join(""));;
                    }

                }
            }
            else if((exp_array[i-1]!=exp_array[i]) & (exp_array[i]=="-" | exp_array[i]=="+" | get_operator_type(operator_list,exp_array[i])=="unary")){

                i++;
                if(identify(exp_array[i])=="integer" | identify(exp_array[i])=="variable" | identify(exp_array[i])=="function"){
                    i++
                    if(i==exp_array.length){

                        break;
    
                    }
                    else if(identify(exp_array[i])=="operator"){
    
                    }
                    else if(exp_array[i]==")"){

                        while(identify(exp_array[i])==")"){
                        pt_count--;
                        i++
                        }
                    }
                    else{
                        array.splice(i,0,"\x1b[32m>>>>>>>>>>>>\x1b[0m");
                        array.splice(i+2,0,"\x1b[32m<<<<<<<<<<<<\x1b[0m");
                        throw new SyntaxError("Unexpected token :" + array.join(""));
                    }

                }
                else if(identify(exp_array[i])=="("){
                    i--;
                }
                else{
                    array.splice(i,0,"\x1b[32m>>>>>>>>>>>>\x1b[0m");
                    array.splice(i+2,0,"\x1b[32m<<<<<<<<<<<<\x1b[0m");
                    throw new SyntaxError("Unexpected token :" + array.join(""));
                }
                
            }
            else if(identify(exp_array[i])=="integer" | identify(exp_array[i])=="variable" | identify(exp_array[i])=="function"){
                i++
                if(i==exp_array.length){

                    break;

                }
                else if(identify(exp_array[i])=="operator"){

                }
                else if(exp_array[i]==")"){

                    while(exp_array[i]==")"){
                        pt_count--;
                        i++
                    }
                }
                else{
                    array.splice(i,0,"\x1b[32m>>>>>>>>>>>>\x1b[0m");
                    array.splice(i+2,0,"\x1b[32m<<<<<<<<<<<<\x1b[0m");
                    throw new SyntaxError("Unexpected token :" + array.join(""));
                }

            }
            else{
                array.splice(i,0,"\x1b[32m>>>>>>>>>>>>\x1b[0m");
                array.splice(i+2,0,"\x1b[32m<<<<<<<<<<<<\x1b[0m");
                errorstring = array.join("")
                throw new SyntaxError("Unexpected token :" +  errorstring);
            }
           
        }
        if(pt_count!=0){
            throw new SyntaxError("Missing parenthese");
        }
        return true;
    }
    return expressionSyntax(array);
}
console.log(Main())