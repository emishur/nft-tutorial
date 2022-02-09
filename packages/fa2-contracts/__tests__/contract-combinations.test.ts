import * as fs from 'fs';
import * as path from 'path';
import { ligo } from '@oxheadalpha/tezos-tools';
import {
  Admin,
  generateFileContent,
  Implementation,
  Minter,
  MinterAdmin
} from '../src/contract-generator';

const implementations: Implementation[] = [
  'USE_NFT_TOKEN',
  'USE_FUNGIBLE_TOKEN',
  'USE_MULTI_FUNGIBLE_TOKEN'
];

const admins: Admin[] = [
  'USE_NO_ADMIN',
  'USE_SIMPLE_ADMIN',
  'USE_PAUSABLE_SIMPLE_ADMIN',
  'USE_MULTI_ADMIN'
];

const minterAdmins: MinterAdmin[] = [
  'USE_NULL_MINTER_ADMIN',
  'USE_ADMIN_AS_MINTER',
  'USE_MULTI_MINTER_ADMIN'
];

const minters: Set<Minter>[] = [
  new Set(),
  new Set(['CAN_MINT']),
  new Set(['CAN_BURN']),
  new Set(['CAN_MINT', 'CAN_BURN']),
  new Set(['CAN_MINT', 'CAN_FREEZE']),
  new Set(['CAN_BURN', 'CAN_FREEZE']),
  new Set(['CAN_MINT', 'CAN_BURN', 'CAN_FREEZE'])
];

function* combinations(): Generator<
  [Implementation, Admin, MinterAdmin, Set<Minter>]
> {
  for (let impl of implementations)
    for (let admin of admins)
      for (let minterAdmin of minterAdmins)
        for (let minter of minters) {
          yield [impl, admin, minterAdmin, minter];
          return;
        }
}

describe('test compilation for contract module combinations', () => {
  const testDir = './__tests__/'
  const ligoEnv = ligo(testDir);
  const contractFile = path.join(testDir,'fa2_contract.mligo');

  test.each([...combinations()])(
    
    'a combination should compile',
    async (implementation, admin, minterAdmin, minter) => {
      //console.log(implementation, admin, minterAdmin, minter);
      const contractCode = generateFileContent({
        implementation,
        admin,
        minterAdmin,
        minter
      });
      fs.writeFileSync(contractFile, contractCode);
      
      throw new Error('TEST')

      fs.unlinkSync(contractFile);
    }
  );

});
