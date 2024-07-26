import React, { useState, useEffect } from 'react';
import ImageCard from './ImageCard';
import styles from './Resource.module.css';
import { useNavigate } from 'react-router-dom';
import { useSendData } from '../../helper/util';

interface resource {
  _id: string,
  title: string,
  blur_url: string,
  description: string,
}
const Resources: React.FC = () => {
  const [images, setImages] = useState<resource[]>([]);
  const [inaccessible, setInaccessible] = useState<resource[]>([]);
  const [errorMsg, setError] = useState<string>('');
  const navigate = useNavigate();
  const sendData = useSendData();


  useEffect(() => {

    const fetchImages = async () => {
      try {

        const data = await sendData('GET', 'get-resources', true);
        const response = data;
        // console.log('data received resources', response)
        setImages(response.resourcesAccessible);
        setInaccessible(response.resourcesInaccessible);
      } catch (error:any) {
        console.error('Error fetching images:', error);
        const err = error.toString().split(':');
        setError(err[1].trim())
      }
    };
    fetchImages();
  }, []);

  return (
    <>
      {errorMsg ? (
        <div className={styles.centerdiv}>

          <div className={styles.noResource}>{errorMsg}</div>
        </div>
      ) : (
        <>
          <div className={`${styles.container} ${styles.inGrp}`}>
            {images.map((image, index) => (
              <ImageCard
                key={image._id}
                id={image._id}
                title={image.title}
                description={image.description}
                url={image.blur_url}
              />
            ))}
          </div>
          {inaccessible.length !== 0 &&
            <div className={styles.outGrp}>
              <div className={styles.heading}>
              <h1>Advanced Member Exclusives</h1>
              <p>Upgrade now to unlock exclusive access to premium resources</p>
              </div>
              <div className={styles.container}>
                {inaccessible.map((image, index) => (
                  <ImageCard
                    key={image._id}
                    id={image._id}
                    title={image.title}
                    description={image.description}
                    url={image.blur_url}
                  />
                ))}
              </div>
            </div>
          }
        </>
      )}
    </>
  );
};

export default Resources;

