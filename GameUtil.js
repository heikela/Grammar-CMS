import { List, Map } from 'immutable';

export const setupPlayers = (rules) => {
  const playerCount = parseInt(rules.players);
  var result = List();
  for (var i = 0; i < playerCount; ++i) {
    result = result.push(
      Map(
        {
          id: i,
          name: '',
          designation: 'Player ' + (i + 1)
        }
      )
    );
  }
  return result;
};
