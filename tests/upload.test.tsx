import { h } from 'preact';
import Upload from '../src/routes/upload/index';
// See: https://github.com/preactjs/enzyme-adapter-preact-pure
import { shallow } from 'enzyme';

describe('Initial Test of the Header', () => {
    test('Header renders 3 nav items', () => {
        const context = shallow(<Upload />);
        
    });
});