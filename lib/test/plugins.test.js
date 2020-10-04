const { expect, } = require('chai');
const gbIlorm = require('..');

const properties = [
  'BaseModel',
  'BaseQuery',
  'Schema',
  'BaseField',
  'Transaction',
];

describe('unit test - ilorm', () => {
  describe('Plugins - ilorm.use', () => {
    let ilorm;
    let origin;

    beforeEach(() => {
      ilorm = new gbIlorm.constructor();
      origin = {};
      properties.forEach((property) => {
        origin[property] = ilorm[property];
      });
    });

    it('ilorm.use without core do nothing', () => {
      ilorm.use({
        plugins: {},
      });

      properties.forEach((property) => {
        expect(ilorm[property]).to.be.equal(origin[property]);
      });
    });

    it('ilorm.use should permit to overwrite BaseModel', () => {
      let NewClass;

      ilorm.use({
        plugins: {
          core: {
            modelFactory: (BaseModel) => {
              NewClass = class New extends BaseModel {};

              return NewClass;
            },
          },
        },
      });

      expect(ilorm.BaseModel).to.be.equal(NewClass);
    });

    it('ilorm.use should permit to overwrite BaseQuery', () => {
      let NewClass;

      ilorm.use({
        plugins: {
          core: {
            queryFactory: (BaseQuery) => {
              NewClass = class New extends BaseQuery {};

              return NewClass;
            },
          },
        },
      });

      expect(ilorm.BaseQuery).to.be.equal(NewClass);
    });

    it('ilorm.use should permit to add customs fields', () => {
      let NewClass;

      // eslint-disable-next-line require-jsdoc
      const customFieldFactory = ({ Field, }) => {
        NewClass = class NewField extends Field {
          // eslint-disable-next-line require-jsdoc
          static getFieldDefinition() {
            return {
              name: 'Custom',
              factory: 'custom',
            };
          }
        };

        return NewClass;
      };

      ilorm.use({
        plugins: {
          core: {
            fieldFactories: {
              CustomField: customFieldFactory,
            },
          },
        },
      });

      expect(ilorm.Schema.Types.Custom).to.be.equal(NewClass);
    });
  });
});
