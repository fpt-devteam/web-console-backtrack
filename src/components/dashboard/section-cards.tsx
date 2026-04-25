import type { CardConfig } from './types';

interface SectionCardsProps {
  cards: CardConfig[];
}

export function SectionCards({ cards }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-[14px] border border-[#dddddd] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#6a6a6a]">{card.label}</span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}
            >
              <span className={card.iconColor}>{card.icon}</span>
            </div>
          </div>

          <div className="text-[2rem] font-semibold text-[#222222] leading-none">
            {card.value}
          </div>

          {card.trend && (
            <div className="flex items-center gap-1 mt-3">
              <span
                className={`text-xs font-medium ${
                  card.trendDirection === 'down'
                    ? 'text-[#c13515]'
                    : card.trendDirection === 'neutral'
                      ? 'text-[#6a6a6a]'
                      : 'text-[#06c167]'
                }`}
              >
                {card.trendDirection === 'down'
                  ? '↓'
                  : card.trendDirection === 'neutral'
                    ? '→'
                    : '↑'}{' '}
                {card.trend}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
