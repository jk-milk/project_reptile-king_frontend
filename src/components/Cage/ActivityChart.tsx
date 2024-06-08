import { VictoryChart, VictoryAxis, VictoryLine, VictoryTheme, VictoryLabel, VictoryTooltip, VictoryLegend } from 'victory';
import { AvgTempHum } from '../../types/Cage';

interface LineChartProps {
  data: AvgTempHum[] | undefined;
  date: string;
  setDate: (value: React.SetStateAction<string>) => void;
}


function ActivityChart({ data, date, setDate }: LineChartProps) {
  return (
    <>
      <div>
        <div className="flex justify-between mb-3">
          <div className="font-bold text-3xl">활동량 분석</div>
          <input
            type="date"
            value={date}
            className="w-52 col-span-3 p-2 border border-gray-300 rounded"
            onChange={(e) => setDate(e.target.value)}
          ></input>
        </div>
        <hr className="border-t border-gray-400" />
        <VictoryChart />
      </div >
    </>

  )
}

export default ActivityChart;
