import expect from 'expect';
import objectAssign from 'src/utils/objectAssign';

describe('objectAssign', () => {
  beforeEach(() => {
    window.Object.assign = undefined;
  });

  it('returns an identical object when 1 object is passed', () => {
    expect(objectAssign(
      {
        foo: 'bar',
        baz: 'qux',
      },
    )).toEqual(
      {
        foo: 'bar',
        baz: 'qux',
      },
    );
  });

  it('returns 1 merged object when multiple objects are passed', () => {
    expect(objectAssign(
      {
        foo: 'bar'
      },
      {
        baz: 'qux',
      },
      {
        corge: 'grault',
      },
    )).toEqual(
      {
        foo: 'bar',
        baz: 'qux',
        corge: 'grault',
      },
    );
  });

  it('returns 1 merged object with properties overwritten when multiple objects are passed', () => {
    expect(objectAssign(
      {
        foo: 'bar'
      },
      {
        foo: 'baz',
      },
    )).toEqual(
      {
        foo: 'baz',
      },
    );
  });
});
