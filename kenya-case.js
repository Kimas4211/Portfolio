const asset=n=>'./assets/kenya/'+n+'.jpg';
export const kenyaCase={
 id:'kenya',eyebrow:'FORM / EXHIBITION DESIGN / PROJECT 01',title:'Kenya Exhibition Hall',zh:'肯尼亚展厅设计',
 hero:{src:'./assets/exhibition/kenya-hall.png',alt:'企业介绍展墙、走廊与参观人物'},
 overview:{name:'Kenya Exhibition Hall',type:'Exhibition Environment / 展厅设计',year:'2026（方案日期）',role:'主要负责人',intro:'以真实空间条件为起点，组织企业介绍、身份信息采集、个性化设备与 IDaaS 展示内容。让墙面信息、设备与参观动线共同构成清晰的空间叙事。'},
 challenge:{title:'Space defines the story.',zh:'先理解空间，再组织信息。',text:'方案中的走廊宽度为 1.4 米，参观者站立阅读的舒适区为离墙 300–400 mm。如两人同时并排停留，会进一步压缩通行空间。设计时，为平衡快速浏览、驻足阅读和信息展示，将展墙信息固定在 900–2300 mm 高度。',facts:[['1.4 m','走廊宽度'],['900–2300 mm','公司介绍墙设计区域']],image:{src:asset('p03-1'),alt:'1.4米走廊中两人并行的空间示意'},source:'方案第3–4页'},
 strategy:{title:'A hierarchy for movement.',zh:'让内容适应动线与阅读高度。',text:'公司介绍墙将主要信息组织在 900–2300 mm 范围；设备展示区将信息上移至 1300–2300 mm，避开设备遮挡。A、E 墙再根据边检及自助设备的独立高度条件调整。',points:['动线与分区：沿 F、D、C、B 墙展开内容。','信息层级：区分企业概览、设备功能与解决方案。','设备关系：在可读区域组织重点内容，避免设备遮挡。'],image:{src:'./assets/kenya/strategy-plan-redacted.png',alt:'展厅平面图与墙面分区',aspectRatio:'2288 / 1348'}},
 process:[
 {title:'Company introduction',zh:'F墙 / 企业介绍墙',text:'6049 mm 长的介绍墙，以 900–2300 mm 为有效设计区域，建立企业信息的阅读层级。',design:{src:asset('p06-2'),alt:'企业介绍墙平面设计'},scene:{src:asset('p07-1'),alt:'企业介绍墙空间效果'},source:'方案第4–7页'},
 {title:'Biometric capture',zh:'D墙 / 采集设备墙',text:'3368 mm 的入口设备区，结合显示器与设备布置，将主要信息集中在 1300–2300 mm 的范围。',design:{src:asset('p11-2'),alt:'生物信息采集展墙设计'},scene:{src:asset('p12-3'),alt:'采集设备墙效果图'},source:'方案第10–12页'},
 {title:'Personalization',zh:'C墙 / 个性化设备墙',text:'2900 mm 的转角展墙，协调个性化设备、桌面与上方信息的关系。',design:{src:asset('p14-2'),alt:'个性化设备展墙设计'},scene:{src:'./assets/kenya/c-wall-experience.png',alt:'C墙个性化设备展墙空间效果'},source:'方案第13–14页；空间效果图由项目负责人补充'},
 {title:'Identity as a service',zh:'B墙 / IDaaS 展示墙',text:'8932 mm 的展示区域，串联案例、IDaaS 方案以及护照与卡片样本。',design:{src:asset('p18-1'),alt:'IDaaS 展墙平面设计'},scene:{src:asset('p19-2'),alt:'IDaaS 展区参观效果'},source:'方案第15–19页'}
 ],
 gallery:[{src:asset('p12-3'),alt:'设备展示与现场讲解的空间效果'},{src:asset('p19-2'),alt:'IDaaS 区域参观效果'},{src:asset('p07-3'),alt:'企业介绍墙局部效果'},{src:'./assets/kenya/gallery-analysis-1.png',alt:'展示厅内部动线与设备高度分析',fit:'contain'},{src:'./assets/kenya/gallery-analysis-2.png',alt:'公司介绍墙信息排布与阅读高度',fit:'contain'},{src:'./assets/kenya/gallery-analysis-3.png',alt:'公司介绍墙有效设计区域分析',fit:'contain'},{src:'./assets/kenya/gallery-analysis-4.png',alt:'A墙设备区域与愿景信息设计',fit:'contain'}],document:null
};
