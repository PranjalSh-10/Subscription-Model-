import React, { useState } from 'react';
import styles from './ImageCard.module.css';
import { useSendData } from '../../helper/util';
// import { sendData } from '../../helper/util';

interface ImageCardProps {
  id: string,
  title: string;
  description: string;
  url: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ id, title, description, url }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [img_url, setUrl] = useState(url);
  const sendData = useSendData();

  const handleClick = async () => {
    console.log('clicked');
    try {

      const response = await sendData('POST', 'access-resource', true, { imageId: id });
      const data = response.url;
      // console.log(data);
      setIsClicked(true);
      setUrl(data);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  return (
    <div
      className={`${styles.card} ${isClicked ? styles.clicked : ''}`}
      onClick={handleClick}
      style={{ pointerEvents: isClicked ? 'none' : 'auto' }}
    >
      <h2 className={styles.title}>{title}</h2>
      <img className={`${styles.image}`} src={img_url} alt={title} />
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default ImageCard;
