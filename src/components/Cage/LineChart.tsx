import { VictoryChart, VictoryAxis, VictoryLine, VictoryTheme, VictoryLabel, VictoryVoronoiContainer, VictoryTooltip, VictoryLegend } from 'victory';
import { AvgTempHum } from '../../types/Cage';

interface LineChartProps {
  data: AvgTempHum[] | undefined;
}

function LineChart({ data }: LineChartProps) {
  if (!data) return <div className="mt-20"></div>;

  const temperatureData = data.map((item) => ({
    x: `${item.month}/${item.day}`,
    y: parseFloat(item.avgtemp),
    label: `온도: ${item.avgtemp}°C`
  }));

  const humidityData = data.map((item) => ({
    x: `${item.month}/${item.day}`,
    y: parseFloat(item.avghum),
    label: `습도: ${item.avghum}%`
  }));

  return (
    <>
      <div className="font-bold text-3xl mb-3">사육장 온습도 현황</div>
      <hr className="border-t border-gray-400" />
      <VictoryChart
        height={200}
        domainPadding={20}
        theme={VictoryTheme.material}
      // containerComponent={
      //   <VictoryVoronoiContainer
      //     voronoiDimension="x"
      //     labels={({ datum }) => `${datum.x}, ${datum.label}`}
      //     labelComponent={
      //       <VictoryTooltip
      //         cornerRadius={0}
      //         flyoutStyle={{ fill: "white" }}
      //       />
      //     }
      //   />
      // }
      >
        <VictoryLabel
          text="사육장 온습도 현황"
          x={75}
          y={30}
          textAnchor="middle"
          style={{ fontSize: 10 }}
        />
        <VictoryAxis
          dependentAxis
          label="온도 (°C)"
          style={{
            axisLabel: { padding: 35, fontSize: 10 }
          }}
        />
        <VictoryAxis
          dependentAxis
          label="습도 (%)"
          orientation="right"
          style={{
            axisLabel: { padding: 35, fontSize: 10 }
          }}
        />
        <VictoryAxis
          label="날짜"
          style={{
            axisLabel: { padding: 30, fontSize: 10 }
          }}
        />
        <VictoryLine
          data={temperatureData}
          style={{
            data: { stroke: "#c43a31" }
          }}
          labels={({ datum }) => datum.label}
          labelComponent={<VictoryTooltip />}
        />
        <VictoryLine
          data={humidityData}
          style={{
            data: { stroke: "#0077b6" }
          }}
          labels={({ datum }) => datum.label}
          labelComponent={<VictoryTooltip />}
        />
        <VictoryLegend x={250} y={20}
          title=""
          centerTitle
          // orientation="horizontal"
          gutter={10} // 항목 간의 간격 줄이기
          style={{
            border: { stroke: "black" },
            title: { fontSize: 10 }, // 범례 제목의 글자 크기 줄이기
            labels: { fontSize: 8 } // 범례 항목의 글자 크기 줄이기
          }}
          // symbolSpacer={5} // 범례 심볼과 텍스트 사이의 간격 조절
          data={[
            { name: "온도", symbol: { fill: "#c43a31", type: "square", size: 4 } }, // 심볼 크기 조절
            { name: "습도", symbol: { fill: "#0077b6", type: "square", size: 4 } } // 심볼 크기 조절
          ]}
        />

      </VictoryChart>
    </>
  )
}

export default LineChart;
