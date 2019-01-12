/* eslint-disable */

const { expect, } = require('chai');
const { spy, } = require('sinon');

const MainStream = require('../main.stream');

describe('ilorm', () => {
  describe('model', () => {
    describe('main.stream', () => {
      it('Should call save method of the instance per each stream element given', async () => {
        const saveSpy = spy();

        class FakeModel {
          save() {
            saveSpy();
          }
        };

        const currentStream = new MainStream({
          Model: FakeModel,
        });

        await currentStream.write({});
        await currentStream.write({});

        expect(saveSpy.callCount).to.be.equal(2);

      });

      it('Should create a stream targeting every element from the database when read', done => {
        let readCounter = 0;

        class FakeModel {
          static query() {
            return {
              stream: () => {
                return {
                  read: () => {
                    if (readCounter < 5) {
                      return ++readCounter;
                    }
                    return null;
                  }
                }
              },
            };
          }
        }


        const currentStream = new MainStream({
          Model: FakeModel,
        });

        let total = 0;

        currentStream.on('data', value => {
          total += value;
        });

        currentStream.on('end', () => {
          expect(readCounter).to.be.equal(5);
          expect(total).to.be.equal(15);
          done();
        });
      });
    });
  });
});
