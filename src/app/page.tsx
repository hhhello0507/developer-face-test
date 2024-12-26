'use client';

import S from "./page.module.css";
import {ChangeEvent, useState} from "react";
import axios from "axios";
import UploadResponse from "@/app/upload.response";
import AiResponse from "@/app/ai.response";

export default function Home() {
    const [result, setResult] = useState<{
        image: string | ArrayBuffer | null,
        file: File
    }>();

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files === null) return;

        const file = files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setResult({
                image: reader.result,
                file
            });
        };
    };

    const fetchDeveloperType = async () => {
        const file = result?.file;
        if (!file) return;
        
        try {
            const {data}: { data: UploadResponse } = await axios.postForm('/api/upload', {
                file,
                fileType: file.type
            });

            const {data: aiData}: { data: AiResponse } = await axios.post('/api/ai', {
                url: data.s3Url
            }, undefined);
            alert(aiData);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={S.page}>
            <span className={S.title}>너는 딱 OOO 개발자</span>
            <label className={S.chooseImageLabel} htmlFor="choose-image">이미지 선택</label>
            <input className={S.chooseImageInput} accept={'image/*'} onChange={handleImageChange} id="choose-image"
                   type="file"/>
            {result && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>
                    <img width={360} src={result.image?.toString()} alt=""/>
                    <button onClick={fetchDeveloperType}>ㄱㄱ</button>
                </div>
            )}
        </div>
    );
}
