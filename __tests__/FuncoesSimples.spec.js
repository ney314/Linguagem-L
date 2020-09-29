import test_resolve_function from '../FuncoesSimples.js';

describe('Cheking Simple Function compiler results',()=>{

    it("Giving soma(4,5) as parameter expected result 9 ",()=>{
        expect(test_resolve_function('soma(4,5)')).toBe(9);
    });

    it("Giving mult(mult(subt(2,3),soma(3,2)),mult(mult(3,2),sqrt(16))) as parameter expected result -120 ",()=>{
        expect(test_resolve_function('mult(mult(subt(2,3),soma(3,2)),mult(mult(3,2),sqrt(16)))')).toBe(-120);
    });

    it("Giving mult(4,5 as parameter expected error ",async()=>{
    
        await expect(()=>{test_resolve_function('mult(4,5')}).toThrow(Error);
    
    });
})