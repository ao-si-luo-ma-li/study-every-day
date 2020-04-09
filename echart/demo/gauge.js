option = {
  tooltip: {
    formatter: "{a} <br/>{c} {b}"
  },
  toolbox: {
    show: true,
    feature: {
      restore: {
        show: true
      },
      saveAsImage: {
        show: true
      }
    }
  },
  series: [{
      name: '速度',
      type: 'gauge',
      z: 3,
      min: 0,
      max: 220,
      splitNumber: 11,
      radius: '26%',
      axisLine: { // 坐标轴线
        lineStyle: { // 属性lineStyle控制线条样式
          width: 10,
          color: [
            [1, new echarts.graphic.LinearGradient(0, 0, 1, 0,
              [{
                  offset: 0,
                  color: "#00AC4A"
                }, {
                  offset: 0.5,
                  color: "#FFEB58"
                },
                {
                  offset: 1,
                  color: "#E14769"
                }
              ], false)]
          ]
        }
      },
      axisTick: { // 坐标轴小标记
        length: 15, // 属性length控制线长
        lineStyle: { // 属性lineStyle控制线条样式
          color: 'auto'
        },
        show: false
      },
      splitLine: { // 分隔线
        length: 20, // 属性length控制线长
        lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
          color: 'auto'
        },
        show: false
      },
      axisLabel: {
        show: false,
        backgroundColor: 'auto',
        borderRadius: 2,
        color: '#eee',
        padding: 3,
        textShadowBlur: 2,
        textShadowOffsetX: 1,
        textShadowOffsetY: 1,
        textShadowColor: '#222'
      },
      title: {
        // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontWeight: 'bolder',
        fontSize: 20,
        fontStyle: 'italic'
      },
      pointer: {
        //   length: 10,
        width: 38
      },
      silent: true,
      detail: {
        // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        formatter: function (value) {
          value = (value + '').split('.');
          value.length < 2 && (value.push('00'));
          return ('00' + value[0]).slice(-2) +
            '.' + (value[1] + '00').slice(0, 2);
        },
        fontWeight: 'bolder',
        borderRadius: 122,
        backgroundColor: '#3E4157',
        borderColor: '#aaa',
        // shadowBlur: 5,
        // shadowColor: '#333',
        // shadowOffsetX: 0,
        // shadowOffsetY: 3,
        // borderWidth: 2,
        textBorderColor: '#000',
        textBorderWidth: 2,
        textShadowBlur: 2,
        textShadowColor: '#fff',
        textShadowOffsetX: 0,
        textShadowOffsetY: 0,
        fontFamily: 'Arial',
        width: 122,
        height: 122,
        lineHeight: 122,
        color: '#eee',
        padding: 0,
        rich: {},
        offsetCenter: [0, 0]
      },
      data: [{
        value: 40,
        name: 'km/h'
      }]
    },
    {
      name: '转速',
      type: 'gauge',
      center: ['20%', '55%'], // 默认全局居中
      radius: '35%',
      min: 0,
      max: 7,
      endAngle: 45,
      splitNumber: 7,
      axisLine: { // 坐标轴线
        lineStyle: { // 属性lineStyle控制线条样式
          width: 8
        }
      },
      axisTick: { // 坐标轴小标记
        length: 12, // 属性length控制线长
        lineStyle: { // 属性lineStyle控制线条样式
          color: 'auto'
        }
      },
      splitLine: { // 分隔线
        length: 20, // 属性length控制线长
        lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
          color: 'auto'
        }
      },
      pointer: {
        width: 5
      },
      title: {
        offsetCenter: [0, '-30%'], // x, y，单位px
      },
      detail: {
        // 其余属性默认使用全局文本样式，详见TEXTSTYLE
        fontWeight: 'bolder'
      },
      data: [{
        value: 1.5,
        name: 'x1000 r/min'
      }]
    },
    {
      name: '油表',
      type: 'gauge',
      center: ['77%', '50%'], // 默认全局居中
      radius: '25%',
      min: 0,
      max: 2,
      startAngle: 135,
      endAngle: 45,
      splitNumber: 2,
      axisLine: { // 坐标轴线
        lineStyle: { // 属性lineStyle控制线条样式
          width: 8
        }
      },
      axisTick: { // 坐标轴小标记
        splitNumber: 5,
        length: 10, // 属性length控制线长
        lineStyle: { // 属性lineStyle控制线条样式
          color: 'auto'
        }
      },
      axisLabel: {
        formatter: function (v) {
          switch (v + '') {
            case '0':
              return 'E';
            case '1':
              return 'Gas';
            case '2':
              return 'F';
          }
        }
      },
      splitLine: { // 分隔线
        length: 15, // 属性length控制线长
        lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
          color: 'auto'
        }
      },
      pointer: {
        width: 2
      },
      title: {
        show: false
      },
      detail: {
        show: false
      },
      data: [{
        value: 0.5,
        name: 'gas'
      }]
    },
    {
      name: '水表',
      type: 'gauge',
      center: ['77%', '50%'], // 默认全局居中
      radius: '25%',
      min: 0,
      max: 2,
      startAngle: 315,
      endAngle: 225,
      splitNumber: 2,
      axisLine: { // 坐标轴线
        lineStyle: { // 属性lineStyle控制线条样式
          width: 8
        }
      },
      axisTick: { // 坐标轴小标记
        show: false
      },
      axisLabel: {
        formatter: function (v) {
          switch (v + '') {
            case '0':
              return 'H';
            case '1':
              return 'Water';
            case '2':
              return 'C';
          }
        }
      },
      splitLine: { // 分隔线
        length: 15, // 属性length控制线长
        lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
          color: 'auto'
        }
      },
      pointer: {
        width: 2
      },
      title: {
        show: false
      },
      detail: {
        show: false
      },
      data: [{
        value: 0.5,
        name: 'gas'
      }]
    }
  ]
};

setInterval(function () {
  option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
  option.series[1].data[0].value = (Math.random() * 7).toFixed(2) - 0;
  option.series[2].data[0].value = (Math.random() * 2).toFixed(2) - 0;
  option.series[3].data[0].value = (Math.random() * 2).toFixed(2) - 0;
  myChart.setOption(option, true);
}, 2000);