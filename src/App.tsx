import * as Brain from "brain.js"
import * as React from 'react';
import './App.css';

import baseImg from './img/arrowRGB.png';
import base2Img from './img/moonmoon.png';

interface IAppState {
  imgURL: string;
  loaded: boolean;
}

interface ITrainDat {
  input: number[];
  output: number[];
}


class App extends React.Component<any, IAppState> {

  private readonly net = new Brain.NeuralNetwork({ hiddenLayers: [5], binaryThresh: 0.5, activation: "sigmoid" });
  private sourceImg: HTMLImageElement;
  private trainData: ITrainDat[];

  constructor(props: any) {
    super(props);
    this.state = { imgURL: baseImg, loaded: false }

    this.buttonClick = this.buttonClick.bind(this);
    console.log(this.net);
  }

  public render() {
    console.log("render");
    return (
      <div>
        <button onClick={this.buttonClick}>Klick</button>
        <div>
          <canvas id="sourceCanvas" />
          <canvas id="resultCanvas" />
        </div>
      </div>
    );
  }

  public componentDidUpdate(prevState: IAppState) {
    if (this.state.loaded === true) {
      this.change();

      this.startTraining(this.trainData);
    }

  }

  public componentDidMount() {
    console.log("mount");
    this.loadIMage(this.state.imgURL);
  }

  private change() {
    console.log("change");
    const imgData = this.getImageData(this.sourceImg);

    this.drawImageData(imgData, ImgSourceType.SOURCE);
    this.drawImageData(new ImageData(imgData.width, imgData.height), ImgSourceType.RESULT);
    this.trainData = this.generateTrainData(imgData);

    // this.drawFromTrainData(trainData);
  }


  private readonly startTraining = (dataToTrain: ITrainDat[]) => {
    /* this.net.train(dataToTrain, {
      iterations: 1000,
      log: true,
      logPeriod: 100
    }); */
  }

  private readonly generateTrainData = (imgDat: ImageData): ITrainDat[] => {
    const trainDat: ITrainDat[] = [];
    for (let x = 0; x < imgDat.width; x++) {
      for (let y = 0; y < imgDat.height; y++) {
        const index = x * 4 + y * 4 * imgDat.width;
        const red = imgDat.data[index];
        const green = imgDat.data[index + 1];
        const blue = imgDat.data[index + 2];

        trainDat.push({
          input: [x / imgDat.width, y / imgDat.height],
          output: [red / 255, green / 255, blue / 255]
        });
      }
    }
    return trainDat;
  }

  private readonly getImageData = (img: HTMLImageElement): ImageData => {
    const canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: any = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height);
  }

  /* private readonly drawFromTrainData = (trainDat: ITrainDat[]) => {
    trainDat.forEach(data => {
      const red = data.output[0] * 255;
      const green = data.output[1] * 255;
      const blue = data.output[2] * 255;

      const canvName = getCanvasName(1);
      const canv: any = document.getElementById(canvName);
      const ctx: any = canv.getContext('2d');


      ctx.beginPath();
      ctx.lineWidth = '1';
      ctx.strokeStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
      ctx.rect(data.input[0] * this.sourceImg.width, data.input[1] * this.sourceImg.height, 1, 1);
      ctx.stroke();
    });
  }
 */

  private readonly loadIMage = (toLoadImg: string) => {
    this.setState({ loaded: false });
    this.sourceImg = new Image();
    this.sourceImg.src = toLoadImg;
    this.sourceImg.onload = () => {
      this.setState({ loaded: true, imgURL: toLoadImg });
    }
  }

  private readonly drawImageData = (data: ImageData, type: ImgSourceType) => {
    const canvName = getCanvasName(type);
    const canv: any = document.getElementById(canvName);
    canv.width = data.width;
    canv.height = data.height;
    const ctx: any = canv.getContext('2d');
    ctx.putImageData(data, 0, 0);
  }

  private buttonClick = () => {
    if (this.state.imgURL === baseImg) {
      this.loadIMage(base2Img);
    }
    else {
      this.loadIMage(baseImg);
    }
  }

}

enum ImgSourceType {
  SOURCE,
  RESULT
}

function getCanvasName(type: ImgSourceType): string {
  switch (type) {
    case ImgSourceType.RESULT:
      return "resultCanvas";
    case ImgSourceType.SOURCE:
      return "sourceCanvas";
  }
}

export default App;
