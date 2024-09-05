// A simple function to test
function add(a: number, b: number): number {
    return a + b;
}

// Dummy test that passes
describe('Dummy Test', () => {
    it('should add 1 + 2 to equal 3', () => {
        expect(add(1, 2)).toBe(3);
    });
});
