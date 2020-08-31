/* eslint-disable */

const { expect, } = require('chai');

const relationClassFactory = require('../relation.classFactory');

const generateFakeIlorm = fakeReferenceMap => ({ modelsRelationsIndex: fakeReferenceMap });

// Fake model:
const MODEL_A = {
  getName: () => 'ModelA',
  getSchema: () => ({
    getPrimaryKeys: () => [],
  }),
};
const MODEL_B = {
  getName: () => 'ModelB',
  getSchema: () => ({
    getPrimaryKeys: () => [],
  }),
};
const MODEL_C = {
  getName: () => 'ModelC',
  getSchema: () => ({
    getPrimaryKeys: () => [],
  }),
};
const MODEL_D = {
  getName: () => 'ModelD',
  getSchema: () => ({
    getPrimaryKeys: () => [],
  }),
};

// Fake attribute:
const ATTRIBUTE_A = Symbol('AttributeA');
const ATTRIBUTE_B = Symbol('AttributeB');


describe('ilorm', () => {
  describe('model', () => {
    describe('relation.classFactory', () => {
      it('Should declare the relation into the reference map after calling the declareRelation on the class', () => {
        const referencesMap = new Map();
        const Relations = relationClassFactory(generateFakeIlorm(referencesMap));

        Relations.declareRelation({
          modelSource: MODEL_A,
          attributeSource: ATTRIBUTE_A,
          modelReferenced: MODEL_B,
          attributeReferenced: ATTRIBUTE_B,
        });

        expect(referencesMap.get(MODEL_A)).to.be.an.instanceof(Map);
        expect(referencesMap.get(MODEL_A).get(MODEL_B)).to.be.an.instanceof(Relations);
        expect(referencesMap.get(MODEL_A).get(MODEL_B).modelA).to.be.equal(MODEL_A);
        expect(referencesMap.get(MODEL_A).get(MODEL_B).modelB).to.be.equal(MODEL_B);
        expect(referencesMap.get(MODEL_A).get(MODEL_B).references).to.deep.include([ATTRIBUTE_A, ATTRIBUTE_B]);

        expect(referencesMap.get(MODEL_B)).to.be.an.instanceof(Map);
        expect(referencesMap.get(MODEL_B).get(MODEL_A)).to.be.an.instanceof(Relations);
        expect(referencesMap.get(MODEL_B).get(MODEL_A).modelA).to.be.equal(MODEL_A);
        expect(referencesMap.get(MODEL_B).get(MODEL_A).modelB).to.be.equal(MODEL_B);
        expect(referencesMap.get(MODEL_A).get(MODEL_B).references).to.deep.include([ATTRIBUTE_A, ATTRIBUTE_B]);

      });
      it('Should get the relation from the reference map after calling the getRelation', () => {
        const referencesMap = new Map();
        const Relations = relationClassFactory(generateFakeIlorm(referencesMap));

        Relations.declareRelation({
          modelSource: MODEL_A,
          attributeSource: ATTRIBUTE_A,
          modelReferenced: MODEL_B,
          attributeReferenced: ATTRIBUTE_B,
        });

        const relationSideA = Relations.getRelation({
          modelSource: MODEL_B,
          modelReferenced: MODEL_A,
        });

        expect(relationSideA.modelA).to.be.equal(MODEL_A);
        expect(relationSideA.modelB).to.be.equal(MODEL_B);
        expect(relationSideA.references).to.deep.include([ATTRIBUTE_A, ATTRIBUTE_B]);

        const relationSideB = Relations.getRelation({
          modelSource: MODEL_A,
          modelReferenced: MODEL_B,
        });

        expect(relationSideB.modelA).to.be.equal(MODEL_A);
        expect(relationSideB.modelB).to.be.equal(MODEL_B);
        expect(relationSideB.references).to.deep.include([ATTRIBUTE_A, ATTRIBUTE_B]);
      });
      it('Should throw error if relation does not exists.', () => {
        const referencesMap = new Map();
        const Relations = relationClassFactory(generateFakeIlorm(referencesMap));

        Relations.declareRelation({
          modelSource: MODEL_A,
          attributeSource: ATTRIBUTE_A,
          modelReferenced: MODEL_B,
          attributeReferenced: ATTRIBUTE_B,
        });

        Relations.declareRelation({
          modelSource: MODEL_A,
          attributeSource: ATTRIBUTE_A,
          modelReferenced: MODEL_C,
          attributeReferenced: ATTRIBUTE_B,
        });

        const missingRelation = () => Relations.getRelation({
          modelSource: MODEL_B,
          modelReferenced: MODEL_C,
        });

        const modelNotInRelation = () => Relations.getRelation({
          modelSource: MODEL_D,
          modelReferenced: MODEL_C,
        });

        expect(modelNotInRelation).to.throw(Error, `ModelD does not exists in references map. Could not be linked with ModelC`);
        expect(missingRelation).to.throw(Error, `ModelB does not reference ModelC`);
      });
    });
  });
});
