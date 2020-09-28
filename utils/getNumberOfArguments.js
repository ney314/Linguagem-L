//Retorna número de argumentos de uma função matemática - Ex: mult = 2, exp = 1
const getNumberOfArguments = (FunctionsList,name) =>{
    return FunctionsList[name][1].args;
}

export default getNumberOfArguments;