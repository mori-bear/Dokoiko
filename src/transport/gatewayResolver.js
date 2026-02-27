import { DEPARTURE_STATIONS } from '../config/constants.js';

/**
 * 交通アイテムを解決する。
 *
 * 常に返すもの:
 *   - yahoo: 経路検索（Yahoo乗換案内）
 *   - jr: JR予約（出発地で振り分け）
 *
 * 条件付き:
 *   - rental: requiresLocalTransport === true の都市のみ
 */
export function resolveGateway(city, departure) {
  const { gateway } = city;
  const items = [];

  const toStation = gateway.rail ? gateway.rail.station : city.name;

  items.push({
    type: 'yahoo',
    from: DEPARTURE_STATIONS[departure] ?? departure,
    to: toStation,
  });

  items.push({ type: 'jr', departure });

  if (gateway.requiresLocalTransport) {
    items.push({ type: 'rental' });
  }

  return items;
}
