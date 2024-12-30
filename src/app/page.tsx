'use client';

import S from "./page.module.css";
import {ChangeEvent, useRef, useState} from "react";
import axios from "axios";
import UploadResponse from "@/app/upload.response";
import AiResponse from "@/app/ai.response";

export default function Home() {
    const [result, setResult] = useState<{
        image?: string | ArrayBuffer,
        file: File
    }>();
    const [aiResponse, setAiResponse] = useState<AiResponse>();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFetching, setIsFetching] = useState(false);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files === null) return;

        const file = files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setResult({
                image: reader.result ?? undefined,
                file
            });
        };
    };

    const fetchDeveloperType = async () => {
        setIsFetching(true);
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
            setAiResponse(aiData);
        } catch (error) {
            console.log(error);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className={S.page}>
            {aiResponse ? (
                <>
                    <div className={S.title}>{aiResponse.developerType}</div>
                    <span className={S.titleDescription}>{aiResponse.description}</span>
                    <div className={S.aiResponseSkillContainer}>
                        {aiResponse.skills.map((skill, index) => (
                            <span key={index} className={S.aiResponseSkill}>{skill}</span>
                        ))}
                    </div>
                    <button className={S.button} onClick={() => {
                        setResult(undefined);
                        setAiResponse(undefined);
                    }}>다시하기
                    </button>
                </>
            ) : (
                <>
                    <span className={S.title}>개발자 관상 테스트</span>
                    <span className={S.titleDescription}>🤔 얼굴을 넣고 어떤 개발자 같이 생겼는지 알아보세요 😰</span>
                    <label className={S.chooseImageLabel} htmlFor="choose-image">
                        {result?.image === undefined || result.image === null
                            ? <>이미지 선택</>
                            : <SelectImage selectedImage={result.image} dismiss={() => {
                                setResult({
                                    ...result,
                                    image: undefined
                                });
                                if (inputRef.current) {
                                    inputRef.current.value = '';
                                }
                            }}/>
                        }
                    </label>
                    <input
                        ref={inputRef}
                        className={S.chooseImageInput}
                        onChange={handleImageChange}
                        accept={'image/*'} id="choose-image"
                        type="file"/>
                    <button className={S.button} onClick={fetchDeveloperType} disabled={isFetching || !result}>시작
                    </button>
                </>
            )}
        </div>
    )
        ;
}

function SelectImage(
    {
        selectedImage,
        dismiss
    }: {
        selectedImage: string | ArrayBuffer,
        dismiss: () => void
    }
) {
    return (
        <div style={{position: 'relative'}}>
            <button onClick={event => {
                event.preventDefault();
                dismiss();
            }} className={S.chooseImageDismissButton}>X
            </button>
            <img className={S.chooseImage} src={selectedImage.toString()} alt=""/>
        </div>
    );
}
