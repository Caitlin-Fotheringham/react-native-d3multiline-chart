import React, {Component} from 'react';
import {Animated} from 'react-native';
import Svg, {Circle, Line, G, Path, Text} from 'react-native-svg';
import * as d3 from 'd3';
import _ from 'lodash';
import createLegend from './utils/createLegend';
import NativePath from './AnimatedSVG';
import NativeCircle from './AnimatedSVGCircle';
import {svgPathProperties} from 'svg-path-properties';
import {
  calculateOverallLineChartData,
  buildColorArray,
} from './utils/dataCalculation';

var linePathOne,
  xCoordinate,
  yCoordinate,
  circleInFirstLine,
  legend;

const dummyData = [[{
  "y": "0",
  "x": 0
}]]

const leftAxisData = [0,1,2,3,4,5,6,7,8,9,10];
const bottomAxisData =  [];

var WIDTH = 380,
  HEIGHT = 380,
  MARGINS = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 30,
  };

function createLineProps (path) {
  const properties = svgPathProperties (path);
  const length = properties.getTotalLength ();
  return {
    d: path,
    strokeDashoffset: new Animated.Value (length),
    strokeDasharray: [length, length],
  };
}

export default class MultipleLineChart extends Component {
  static defaultProps= {
    data: dummyData,
    leftAxisData: leftAxisData,
    bottomAxisData: bottomAxisData,
    axisColor: '#000',
    axisLabelColor: '#000',
    axisLineWidth: 1,
    chartFontSize: 10,
    color: [],
    dataPointRadius: 3,
    lineWidth: 2,
    hideAxis: false,
    dataPointsVisible: true,
    hideXAxisLabels: false,
    hideYAxisLabels: false,
    chartHeight: HEIGHT,
    chartWidth: WIDTH,
    showLegends: true,
    tickColorXAxis: '#000',
    tickWidthXAxis: '1',
    tickColorYAxis: '#000',
    tickWidthYAxis: '1',
    circleRadiusWidth: '2.5',
    circleRadius: 3,
    showTicks: true,
    lineStrokeOpacity: 1,
    lineStrokeDashArray: ['3', '0'],
    showDashedLine: false,
    GraphWidth: 400,
    GraphHeight: 500,
    bottomAxisDataToShow: bottomAxisData,
    leftAxisDataToShow: leftAxisData,
    pointDataToShowOnGraph: 'Y',
    legendStyle: {
      width: 50,
      fillOpacity: 0.5,
      height: 20,
      strokeWidth: 2,
      legendFontSize: 12,
      legentTextFill: 'black',
    },
    circleLegendType: true,
    fillArea: false,
    yAxisGrid: false,
    xAxisGrid: false,
    hideXAxis: false,
    hideYAxis: false,
    inclindTick: true,
    animation: true,
    delay: 500,
    duration: 2000,
    staggerLength: 200,
    speed: 40,
  };

  constructor (props) {
    super (props);
  }

  animate () {
    const {
      delay,
      duration,
      staggerLength,
      speed,
      circleRadius,
      data,
    } = this.props;
    const animate = [Animated.delay (delay)];
    let counter = 0;
    this.lineAnimated.forEach ((element, j) => {
      let staggerCircle = [];
      for (let k = counter; k < data[j].length + counter; k++) {
        staggerCircle.push (
          Animated.spring (this.AnimatedPoints[k].r, {
            toValue: circleRadius,
            speed,
          })
        );
      }
      this.AnimatedPoints.map ((point, i) => {
        if (i < data[j].length + counter && i >= counter) return;
        return null;
      });
      animate.push (
        Animated.parallel ([
          Animated.timing (element.strokeDashoffset, {
            toValue: 0,
            duration,
          }),
        ]),
        Animated.stagger (staggerLength, staggerCircle)
      );
      counter = counter + data[j].length;
    });
    Animated.sequence (animate).start ();
  }

  treeManipulation () {
    const {
      data,
      leftAxisData,
      bottomAxisData,
      legendColor,
      legendText,
      minX,
      minY,
      maxX,
      maxY,
      scatterPlotEnable,
      dataPointsVisible,
      hideAxis,
      hideXAxisLabels,
      hideYAxisLabels,
      showLegends,
      axisColor,
      axisLabelColor,
      axisLineWidth,
      chartFontSize,
      Color,
      chartHeight,
      chartWidth,
      tickColorXAxis,
      tickColorYAxis,
      tickWidthXAxis,
      tickWidthYAxis,
      lineWidth,
      circleRadiusWidth,
      circleRadius,
      showTicks,
      legendStyle,
      lineStrokeOpacity,
      lineStrokeDashArray,
      showDashedLine,
      leftAxisDataToShow,
      bottomAxisDataToShow,
      pointDataToShowOnGraph,
      circleLegendType,
      fillArea,
      animation,
    } = this.props;
    const {
      yAxisGrid,
      xAxisGrid,
      hideXAxis,
      hideYAxis,
      inclindTick,
    } = this.props;
    this.lineAnimated = new Array (data.length);
    const xScale = d3
      .scaleLinear ()
      .range ([MARGINS.left, chartWidth - MARGINS.right])
      .domain ([minX, maxX]),
      yScale = d3
        .scaleLinear ()
        .range ([chartHeight - MARGINS.top, MARGINS.bottom])
        .domain ([minY, maxY]),
      xAxis = d3.axisBottom (xScale),
      yAxis = d3
        .axisLeft (yScale)
        .ticks (d3.timeDay, 1)
        .tickFormat (d3.timeFormat ('%a %d'));
    const TICKSIZE = chartWidth / 35;
    let x = 0, y = chartHeight - MARGINS.top;
    let endX = x + chartWidth;
    let endY = y;
    xCoordinate = hideAxis
      ? null
      : <G fill="none">
          {hideXAxis
            ? null
            : <Line
                stroke={axisColor}
                strokeWidth={axisLineWidth}
                x1={x + 30}
                x2={endX + 30}
                y1={y}
                y2={endY}
              />}
          {showTicks
            ? _.map (bottomAxisData, function (d, i) {
                return (
                  <Line
                    key={i}
                    stroke={tickColorXAxis}
                    strokeWidth={tickWidthXAxis}
                    x1={xScale (d) + 10}
                    y1={y}
                    x2={inclindTick ? xScale (d) - 2 : xScale (d) + 10}
                    y2={xAxisGrid ? 20 : y + TICKSIZE}
                  />
                );
              })
            : null}
          {hideXAxisLabels
            ? null
            : _.map (bottomAxisData, function (d, i) {
                return (
                  <Text
                    key={i}
                    fill={axisLabelColor}
                    fontSize={chartFontSize}
                    textAnchor="middle"
                    x={inclindTick ? xScale (d) - 2 : xScale (d) + 10}
                    y={chartHeight + 10}
                  >
                    {bottomAxisDataToShow[i]}
                  </Text>
                );
              })}
        </G>;

    let xx = 0, yy = chartHeight;
    let endXX = xx;
    let endYY = yy - chartWidth;
    yCoordinate = hideAxis
      ? null
      : <G fill="none">
          {hideYAxis
            ? null
            : <Line
                stroke={axisColor}
                strokeWidth={axisLineWidth}
                x1={xx + 40}
                x2={endXX + 40}
                y1={yy}
                y2={endYY}
              />}
          {showTicks
            ? _.map (leftAxisData, function (d, i) {
                return (
                  <Line
                    key={i}
                    stroke={tickColorYAxis}
                    strokeWidth={tickWidthYAxis}
                    x1={xx + 40}
                    y1={yScale (d)}
                    x2={yAxisGrid ? chartWidth - 10 : xx + 30}
                    y2={inclindTick ? yScale (d) - 5 : yScale (d)}
                  />
                );
              })
            : null}
          {hideYAxisLabels
            ? null
            : _.map (leftAxisData, function (d, i) {
                return (
                  <Text
                    key={i}
                    fill={axisLabelColor}
                    fontSize={chartFontSize}
                    textAnchor="middle"
                    x={inclindTick ? xx + 25 : xx + 20}
                    y={inclindTick ? yScale (d) - 20 : yScale (d) - 8}
                  >
                    {leftAxisDataToShow[i]}
                  </Text>
                );
              })}
        </G>;

    var lineGen = d3
      .line ()
      .x (function (d) {
        return xScale (d.x) + 10;
      })
      .y (function (d) {
        return yScale (d.y);
      });

    let linePointsData = formatLineData (data);
    linePathOne = scatterPlotEnable
      ? null
      : animation
          ? _.map (linePointsData, (data, i) => {
              this.lineAnimated[i] = createLineProps (data);
              return (
                <NativePath
                  {...this.lineAnimated[i]}
                  strokeOpacity={lineStrokeOpacity}
                  key={i}
                  fill={'none'}
                  stroke={Color[i] ? Color[i] : '#000'}
                  strokeWidth={lineWidth}
                />
              );
            })
          : _.map (linePointsData, (data, i) => {
              return (
                <Path
                  strokeOpacity={lineStrokeOpacity}
                  strokeDasharray={showDashedLine ? lineStrokeDashArray[i] : ''}
                  key={i}
                  d={data}
                  fill={fillArea ? (Color[i] ? Color[i] : '#000') : 'none'}
                  stroke={Color[i] ? Color[i] : '#000'}
                  strokeWidth={lineWidth}
                />
              );
            });
    let dataPointsColor = buildColorArray (data, Color);

    let pointData = calculateOverallLineChartData (data);
    this.AnimatedPoints = new Array (pointData.length);
    circleInFirstLine = dataPointsVisible
      ? _.map (pointData, (d, i) => {
          let text;
          this.AnimatedPoints[i] = createCircleProps (d, dataPointsColor[i]);
          text = (
            <Text
              fontSize={chartFontSize}
              x={xScale (d.x) + 10}
              y={yScale (d.y) + 5}
            >
              {pointDataToShowOnGraph == 'Y'
                ? d.y
                : pointDataToShowOnGraph == 'X' ? d.x : ''}
            </Text>
          );
          return (
            <G key={i}>
              {animation
                ? <NativeCircle
                    key={'circle_' + i}
                    {...this.AnimatedPoints[i]}
                  />
                : <Circle
                    key={'circle_' + i}
                    strokeWidth={circleRadiusWidth}
                    stroke={dataPointsColor[i]}
                    d={d.x}
                    fill={'white'}
                    cx={xScale (d.x) + 10}
                    cy={yScale (d.y)}
                    r={circleRadius}
                  />}
              {text}
            </G>
          );
        })
      : null;

    legend = showLegends
      ? createLegend (
          legendColor,
          legendText,
          chartWidth,
          MARGINS,
          legendStyle,
          circleLegendType
        )
      : null;

    function formatLineData (data) {
      let linePointsData = [], lineDataArray = [];

      for (let i = 0; i < data.length; i++) {
        lineDataArray.push (data[i]);
      }
      for (var i = 0; i < lineDataArray.length; i++) {
        linePointsData.push (lineGen (lineDataArray[i]));
      }

      return linePointsData;
    }
    function createCircleProps (d, strokeColor) {
      return {
        r: new Animated.Value (0),
        cx: xScale (d.x) + 10,
        cy: yScale (d.y),
        stroke: strokeColor,
        strokeWidth: circleRadiusWidth,
        fill: 'white',
      };
    }
    if (animation) this.animate ();
  }

  render () {
    this.treeManipulation ();
    const {GraphWidth, GraphHeight} = this.props;
    return (
      <Svg width={GraphWidth} height={GraphHeight}>
        <G>
          {yCoordinate}
          {xCoordinate}
          {linePathOne}
          {circleInFirstLine}
          {legend}
        </G>
      </Svg>
    );
  }
}
