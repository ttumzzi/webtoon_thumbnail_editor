import React, { useRef, useState } from 'react';
import '../styles/Main.scss';
import Button from '@material-ui/core/Button';
import Cropper from './Cropper';
import Resizer from './Resizer';

const Main = props => {
  const canvasRef = useRef(null);
  const [canvasScale, setCanvasScale] = useState({});
  const [cropperInfo, setCropperInfo] = useState({});
  const [imgSrc, setImgSrc] = useState(null);

  const openImage = evt => {
    console.log(evt.target.files[0]);
    const canvasEl = canvasRef.current;
    const context = canvasEl.getContext(`2d`);
    const img = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = readerEvt => {
      const image = new Image();

      image.src = readerEvt.target.result;
      image.onload = () => {
        setImgSrc(image);

        const maxWidth = 800;
        let { width } = image;
        let { height } = image;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else if (height > maxWidth) {
          width *= maxWidth / height;
          height = maxWidth;
        }
        canvasEl.width = width;
        canvasEl.height = height;
        context.drawImage(image, 0, 0, width, height);
        if (canvasRef.current) {
          const { offsetLeft, offsetTop } = canvasRef.current;
          setCanvasScale({
            left: offsetLeft,
            top: offsetTop,
            width,
            height,
          });
          setCropperInfo({
            left: offsetLeft,
            top: offsetTop,
            width,
            height,
          });
        }
      };
    };
    if (img) {
      reader.readAsDataURL(img);
    }
  };

  const [cropIsActive, setCropIsActive] = useState(false);
  const startCrop = e => {
    e.preventDefault();
    setCropIsActive(!cropIsActive);
  };

  const [cropperChange, setCropperChange] = useState({
    prevWidth: 0,
    prevHeight: 0,
    prevX: 0,
    prevY: 0,
    startX: 0,
    startY: 0,
  });

  const [activeResize, setActiveResize] = useState(false);
  const [direction, setDirection] = useState('');
  const startResize = e => {
    e.preventDefault();
    setActiveResize(true);
    setDirection(e.target.dataset.dir);
    setCropperChange({
      prevWidth: cropperInfo.width,
      prevHeight: cropperInfo.height,
      prevX: cropperInfo.left,
      prevY: cropperInfo.top,
      startX: e.clientX,
      startY: e.clientY,
    });
  };
  const resizing = e => {
    e.preventDefault();
    const diffX = cropperChange.startX - e.clientX;
    const diffY = cropperChange.startY - e.clientY;
    const { prevWidth, prevHeight, prevX, prevY } = cropperChange;
    if (activeResize) {
      switch (direction) {
        case 'se':
          setCropperInfo(prev => ({
            ...prev,
            width: prevWidth - diffX,
            height: prevHeight - diffY,
          }));
          break;
        case 'ne':
          setCropperInfo(prev => ({
            ...prev,
            top: prevY - diffY,
            width: prevWidth - diffX,
            height: prevHeight + diffY,
          }));
          break;
        case 'sw':
          setCropperInfo(prev => ({
            ...prev,
            left: prevX - diffX,
            width: prevWidth + diffX,
            height: prevHeight - diffY,
          }));
          break;
        case 'nw':
          setCropperInfo({
            top: prevY - diffY,
            left: prevX - diffX,
            width: prevWidth + diffX,
            height: prevHeight + diffY,
          });
          break;
        default:
          break;
      }
    }
  };
  const finishResize = e => {
    e.preventDefault();
    setActiveResize(false);
  };

  const [isResize, setIsResize] = useState(false);

  const startResize = e => {
    e.preventDefault();
    setIsResize(true);
  };

  return (
    <section>
      <aside>
        <Button className="open-btn" variant="contained" color="primary">
          OPEN IMAGE
          <input
            className="open-file"
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={openImage}
          />
        </Button>
        {canvasRef.current && (
          <>
            <Button className="open-btn" variant="contained" color="primary" onClick={startCrop}>
              Crop
            </Button>
            <Button className="open-btn" variant="contained" color="primary" onClick={startResize}>
              Resize
            </Button>
          </>
        )}
      </aside>
      <article className="editor-container horizontal" onMouseUp={finishResize}>
        <div onMouseMove={resizing}>
          <canvas className="editor" ref={canvasRef} />
          {cropIsActive && <Cropper startResize={startResize} cropperInfo={cropperInfo} />}
        </div>
      </article>
    </section>
  );
};

export default Main;
