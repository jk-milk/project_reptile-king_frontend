import { VictoryChart, VictoryAxis, VictoryLine, VictoryTheme, VictoryLabel, VictoryTooltip, VictoryLegend } from 'victory';
import { AvgTempHum } from '../../types/Cage';

interface LineChartProps {
  data: AvgTempHum[] | undefined;
  date: string;
  setDate: (value: React.SetStateAction<string>) => void;
}

interface ProcessedDataItem {
  hour: number;
  avgtemp: number | null;
  avghum: number | null;
}

function preprocessData(data: AvgTempHum[]): ProcessedDataItem[] {
  const completeData: ProcessedDataItem[] = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    avgtemp: null,
    avghum: null,
  }));

  data.forEach(item => {
    const index = parseInt(item.hour, 10); // hour 값을 숫자로 변환
    if (index >= 0 && index < 24) {
      // avgtemp와 avghum 값을 숫자로 변환, 유효하지 않은 경우(null이나 NaN) null을 할당
      completeData[index].avgtemp = item.avgtemp ? parseFloat(item.avgtemp) : null;
      completeData[index].avghum = item.avghum ? parseFloat(item.avghum) : null;
    }
  });

  return completeData;
}

function TemHumChart({ data, date, setDate }: LineChartProps) {

  // 시간축에 사용할 홀수 + 0 배열
  const oddNumbers = Array.from({ length: 12 }, (_, i) => 2 * i + 1);
  // 배열의 앞부분에 0 추가
  oddNumbers.unshift(0);

  // 온습도 데이터가 없는 경우
  if (!data || data.length === 0) {
    return (
      <>
        <div className="flex justify-between mb-3">
          <div className="font-bold text-3xl">사육장 온습도 현황</div>
          <input
            type="date"
            value={date}
            className="w-52 col-span-3 p-2 border border-gray-300 rounded"
            onChange={(e) => setDate(e.target.value)}
          ></input>
        </div>
        <hr className="border-t border-gray-400" />
        <VictoryChart
          height={200}
          domainPadding={{ x: 0 }}
          domain={{ x: [0, 23], y: [0, 100] }} // X축과 Y축의 범위 설정, Y축은 예시로 0부터 100으로 설정
          theme={VictoryTheme.material}
        >
          <VictoryLabel
            text="온도 (°C)"
            x={35}
            y={30}
            textAnchor="middle"
            style={{ fontSize: 9 }}
          />
          <VictoryLabel
            text="습도 (%)"
            x={310}
            y={30}
            textAnchor="middle"
            style={{ fontSize: 9 }}
          />
          <VictoryAxis
            dependentAxis
            // label="온도 (°C)"
            style={{
              // axis: { stroke: 'transparent' },
              // ticks: { stroke: 'transparent' },
              axisLabel: { padding: 40, fontSize: 9, angle: 0 },
              tickLabels: { fontSize: 7 }
            }}
          />
          <VictoryAxis
            dependentAxis
            // label="습도 (%)"
            orientation="right"
            style={{
              axisLabel: { padding: 25, fontSize: 9, angle: 0 },
              tickLabels: { fontSize: 7 }
            }}
          />
          <VictoryAxis
            crossAxis
            label="시간"
            tickValues={oddNumbers} // 0을 포함한 홀수 배열
            style={{
              // axis: {stroke: 'transparent'},
              ticks: { stroke: 'transparent', padding: -7 },
              axisLabel: { padding: 20, fontSize: 10 },
              tickLabels: { fontSize: 5 }
            }}
          />
          <VictoryLabel
            text="데이터가 없습니다."
            x={170} // 차트 중앙에 위치하도록 조정
            y={100}
            textAnchor="middle"
            style={{ fontSize: 15 }}
          />
          <VictoryLegend x={230} y={10}
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
              { name: "습도", symbol: { fill: "#c43a31", type: "square", size: 4 } },
              { name: "온도", symbol: { fill: "#0077b6", type: "square", size: 4 } },
            ]}
          />
        </VictoryChart>
      </>
    );
  }

  // 데이터 전처리
  const completeData = preprocessData(data);

  // 온습도 데이터 
  const temperatureData = completeData.map((item) => ({
    x: item.hour,
    y: item.avgtemp !== null ? item.avgtemp : null,
    label: item.avgtemp !== null ? `온도: ${item.avgtemp}°C` : undefined
  }));

  const humidityData = completeData.map((item) => ({
    x: item.hour,
    y: item.avghum !== null ? item.avghum : null,
    label: item.avghum !== null ? `습도: ${item.avghum}%` : undefined
  }));

  // 데이터가 있는 경우
  return (
    <>
      <div className="flex justify-between mb-3">
        <div className="font-bold text-3xl">사육장 온습도 현황</div>
        <input
          type="date"
          value={date}
          className="w-52 col-span-3 p-2 border border-gray-300 rounded"
          onChange={(e) => setDate(e.target.value)}
        ></input>
      </div>
      <hr className="border-t border-gray-400" />
      <VictoryChart
        height={200}
        domainPadding={{ x: 0 }}
        domain={{ x: [0, 23], y: [0, 100] }} // X축과 Y축의 범위 설정, Y축은 예시로 0부터 100으로 설정
        theme={VictoryTheme.material}
      >
        {/* <VictoryLabel
          text="사육장 온습도 현황"
          x={75}
          y={30}
          textAnchor="middle"
          style={{ fontSize: 10 }}
        /> */}
        <VictoryLabel
          text="온도 (°C)"
          x={35}
          y={30}
          textAnchor="middle"
          style={{ fontSize: 9 }}
        />
        <VictoryLabel
          text="습도 (%)"
          x={310}
          y={30}
          textAnchor="middle"
          style={{ fontSize: 9 }}
        />
        <VictoryAxis
          dependentAxis
          // label="온도 (°C)"
          style={{
            // axis: { stroke: 'transparent' },
            // ticks: { stroke: 'transparent' },
            axisLabel: { padding: 40, fontSize: 9, angle: 0 },
            tickLabels: { fontSize: 7 }
          }}
        />
        <VictoryAxis
          dependentAxis
          // label="습도 (%)"
          orientation="right"
          style={{
            axisLabel: { padding: 25, fontSize: 9, angle: 0 },
            tickLabels: { fontSize: 7 }
          }}
        />
        <VictoryAxis
          crossAxis
          label="시간"
          tickValues={oddNumbers} // 0을 포함한 홀수 배열
          style={{
            // axis: {stroke: 'transparent'},
            ticks: { stroke: 'transparent', padding: -7 },
            axisLabel: { padding: 20, fontSize: 10 },
            tickLabels: { fontSize: 5 }
          }}
        />
        <VictoryLine
          data={temperatureData}
          style={{
            data: { stroke: "#0077b6" }
          }}
          labels={({ datum }) => datum.label}
          labelComponent={<VictoryTooltip />}
        />
        <VictoryLine
          data={humidityData}
          style={{
            data: { stroke: "#c43a31" }
          }}
          labels={({ datum }) => datum.label}
          labelComponent={<VictoryTooltip />}
        />
        <VictoryLegend x={230} y={10}
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
            { name: "습도", symbol: { fill: "#c43a31", type: "square", size: 4 } },
            { name: "온도", symbol: { fill: "#0077b6", type: "square", size: 4 } },
          ]}
        />
      </VictoryChart>
    </>
  );
}

export default TemHumChart;
