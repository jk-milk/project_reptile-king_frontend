import { VictoryChart, VictoryAxis, VictoryLine, VictoryTheme, VictoryLabel } from 'victory';
import { AvgTempHum } from '../../types/Cage';

interface LineChartProps {
  data: AvgTempHum[] | undefined;
}

function LineChart({ data }: LineChartProps) {
  if (!data) return <div className="mt-20"></div>;

  // 모든 데이터 포인트를 포함하는 temperatureData와 humidityData 배열 생성
  const temperatureData = data.map((item) => ({
    x: `${item.month}/${item.day}`,
    y: parseFloat(item.avgtemp),
  }));

  const humidityData = data.map((item) => ({
    x: `${item.month}/${item.day}`,
    y: parseFloat(item.avghum),
  }));

  return (
    <>
      <div className="font-bold text-3xl mb-3">사육장 온습도 현황</div>
      <hr className="border-t border-gray-400" />
      <VictoryChart
        height={200}
        domainPadding={20}
        theme={VictoryTheme.material}
      >
        <VictoryLabel 
          text="사육장 온습도 현황" 
          x={75} 
          y={30} 
          textAnchor="middle"
          style={{ fontSize: 10 }}
        />
        {/* 온도 데이터를 위한 Y축 (왼쪽) */}
        <VictoryAxis 
          dependentAxis
          label="온도 (°C)"
          style={{
            axisLabel: { padding: 35 }
          }}
        />
        {/* 습도 데이터를 위한 Y축 (오른쪽) */}
        <VictoryAxis 
          dependentAxis
          label="습도 (%)"
          orientation="right"
          style={{
            axisLabel: { padding: 40 }
          }}
        />
        {/* X축 */}
        <VictoryAxis
          label="날짜"
          // // 날짜 형식의 x값에서 조건에 맞는 라벨만 표시하도록 tickFormat 설정
          // tickFormat={(x) => {
          //   const [month, day] = x.split('/');
          //   return parseInt(day) % 5 === 0 ? `${month}/${day}` : '';
          // }}
          style={{
            axisLabel: { padding: 30 }
          }}
        />
        {/* 온도 데이터를 위한 그래프 */}
        <VictoryLine
          data={temperatureData}
          style={{
            data: { stroke: "#c43a31" }
          }}
        />
        {/* 습도 데이터를 위한 그래프 */}
        <VictoryLine
          data={humidityData}
          style={{
            data: { stroke: "#0077b6" }
          }}
        />
      </VictoryChart>
    </>
  )
}

export default LineChart;
