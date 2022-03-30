import { toBoolean } from '../src/utils/helper';


describe('Testing ./src/utils/helper', () => {
	describe('Testing toBoolean(val: string)', () => {
		it('Should return true by passing in string true', () => {
			expect(toBoolean('true')).toBeTruthy;
		});
		it('Should return false by passing any other value', () => {
			expect(toBoolean('false')).toBeFalsy;
			expect(toBoolean('any other string')).toBeFalsy;
		});
	});
});