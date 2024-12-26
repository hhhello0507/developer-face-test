import OpenAI from "openai";
import {NextRequest, NextResponse} from "next/server";
import AiResponse from "@/app/ai.response";

const client = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
});

export async function POST(request: NextRequest): Promise<NextResponse<AiResponse>> {
    const {url} = await request.json();
    
    const response = await client.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `사진의 옷차림이나 표정 등을 보고 어떤 개발자인지, 어떤 기술 스택을 사용할 것 같은지 아래와 같은 형식으로 답변해줘. mz스럽고 장난스럽게
{
    "developerType": "Android 앱",
    "description": "근엄한 표정을 하고 있지만 귀여운 손동작을 보니 이 분은 Android 앱 개발자 같습니다."
    "skills": [
        "Kotlin 을 매우 능숙하게 다룸",
        "Jetpack Compose 중독자",
        "Material Design 없으면 못 삼.",
        "Android Studio같은 Jetbrains IDE 선호",
        "minSdkVersion 낮추라고 하면 "ㄴㄴ 무조건 최신으로 가야 돼" ㅋㅋㅋㅋㅋㅋㅋ"
        "Kotlin 찬양 교단 신자. 안드로이드 스튜디오 꿀렁꿀렁 돌아가는 거에도 존버 정신 있음."
    ]
}`
                    },
                ]
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: {
                            url
                        }
                    }
                ]
            }
        ],
        model: 'gpt-4-turbo',
        max_tokens: 400
    });

    const message = response.choices[0].message.content ?? ''
    
    return NextResponse.json(JSON.parse(message));
}