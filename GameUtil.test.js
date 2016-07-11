import { testCase } from './trivialRunner';
import expect from 'expect';

import { setupPlayers } from './GameUtil';

import { Map, List } from 'immutable';

testCase('setupPlayersShouldCreateAPlayerArray', () => {
    expect(
      setupPlayers({
        players: '2'
      })
    ).toEqual(
      List([
          Map({
              id: 0,
              name: '',
              designation: 'Player 1'
          }),
          Map({
            id: 1,
            name: '',
            designation: 'Player 2'
          })
      ])
    );
  }
);
