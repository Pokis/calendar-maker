import type { MonthData } from '../types';

interface CalendarGridProps {
    data: MonthData;
}

export function CalendarGrid({ data }: CalendarGridProps) {
    return (
        <div className="calendar-grid">
            <h3 className="month-title">
                {data.name} {data.year}
            </h3>
            <table className="month-table">
                <thead>
                    <tr>
                        {data.dayNames.map((day, i) => (
                            <th key={i} className={i >= 5 ? 'weekend-header' : ''}>
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.weeks.map((week, wi) => (
                        <tr key={wi}>
                            {week.map((day, di) => (
                                <td
                                    key={di}
                                    className={`day-cell ${day === null ? 'empty' : ''} ${di >= 5 ? 'weekend' : ''}`}
                                >
                                    {day !== null && <span className="day-number">{day}</span>}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
