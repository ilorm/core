/* eslint-disable */

const { expect, } = require('chai');

const relationClassFactory = require('../relation.classFactory');

const generateFakeIlorm = fakeReferenceMap => ({ modelsRelationsIndex: fakeReferenceMap });

// Fake model:
const MODEL_A = 'ModelA';
const MODEL_B = 'ModelB';
const MODEL_C = 'ModelC';
const MODEL_D = 'ModelD';

// Fake attribute:
const ATTRIBUTE_A = Symbol('AttributeA');


describe('ilorm', () => {
  describe('model', () => {
    describe('relation.classFactory', () => {
      it('Should declare the relation into the reference map after calling the declareRelation on the class', () => {
        const referencesMap = new Map();
        const Relations = relationClassFactory(generateFakeIlorm(referencesMap));

        Relations.declareRelation({
          modelSource: MODEL_A,
          attributeSource: ATTRIBUTE_A,
          modelReference: MODEL_B
        });

        expect(referencesMap.get(MODEL_A)).to.be.an.instanceof(Map);
        expect(referencesMap.get(MODEL_A).get(MODEL_B)).to.be.an.instanceof(Relations);
        expect(referencesMap.get(MODEL_A).get(MODEL_B).modelA).to.be.equal(MODEL_A);
        expect(referencesMap.get(MODEL_A).get(MODEL_B).modelB).to.be.equal(MODEL_B);
        expect(referencesMap.get(MODEL_A).get(MODEL_B).referenceA).to.be.equal(ATTRIBUTE_A);
        expect(referencesMap.get(MODEL_A).get(MODEL_B).referenceB).to.be.equal(Relations.Primary);

        expect(referencesMap.get(MODEL_B)).to.be.an.instanceof(Map);
        expect(referencesMap.get(MODEL_B).get(MODEL_A)).to.be.an.instanceof(Relations);
        expect(referencesMap.get(MODEL_B).get(MODEL_A).modelA).to.be.equal(MODEL_B);
        expect(referencesMap.get(MODEL_B).get(MODEL_A).modelB).to.be.equal(MODEL_A);
        expect(referencesMap.get(MODEL_B).get(MODEL_A).referenceA).to.be.equal(Relations.Primary);
        expect(referencesMap.get(MODEL_B).get(MODEL_A).referenceB).to.be.equal(ATTRIBUTE_A);
      });
      it('Should get the relation from the reference map after calling the getRelation', () => {
        const referencesMap = new Map();
        const Relations = relationClassFactory(generateFakeIlorm(referencesMap));

        Relations.declareRelation({
          modelSource: MODEL_A,
          attributeSource: ATTRIBUTE_A,
          modelReference: MODEL_B
        });

        const relationSideA = Relations.getRelation({
          modelSource: MODEL_B,
          modelReference: MODEL_A,
        });

        expect(relationSideA.modelA).to.be.equal(MODEL_B);
        expect(relationSideA.modelB).to.be.equal(MODEL_A);
        expect(relationSideA.referenceA).to.be.equal(Relations.Primary);
        expect(relationSideA.referenceB).to.be.equal(ATTRIBUTE_A);

        const relationSideB = Relations.getRelation({
          modelSource: MODEL_A,
          modelReference: MODEL_B,
        });

        expect(relationSideB.modelA).to.be.equal(MODEL_A);
        expect(relationSideB.modelB).to.be.equal(MODEL_B);
        expect(relationSideB.referenceA).to.be.equal(ATTRIBUTE_A);
        expect(relationSideB.referenceB).to.be.equal(Relations.Primary);
      });
      it('Should throw error if relation does not exists.', () => {
        const referencesMap = new Map();
        const Relations = relationClassFactory(generateFakeIlorm(referencesMap));

        Relations.declareRelation({
          modelSource: MODEL_A,
          attributeSource: ATTRIBUTE_A,
          modelReference: MODEL_B
        });

        Relations.declareRelation({
          modelSource: MODEL_A,
          attributeSource: ATTRIBUTE_A,
          modelReference: MODEL_C
        });

        const missingRelation = () => Relations.getRelation({
          modelSource: MODEL_B,
          modelReference: MODEL_C,
        });

        const modelNotInRelation = () => Relations.getRelation({
          modelSource: MODEL_D,
          modelReference: MODEL_C,
        });

        expect(modelNotInRelation).to.throw(Error, `ModelD does not exists in references map. Could not be linked with ModelC`);
        expect(missingRelation).to.throw(Error, `ModelB does not reference ModelC`);
      });
    });
  });
});
