import Image from "next/image";
import { useState } from "react";
import { toast } from 'react-toastify';

const SuperVillainCard = ({ name, age, powers, price, imageUrl }) => {
    const [story, setStory] = useState('');
    const [sceneImageUrl, setSceneImageUrl] = useState('');

    const handleRentClick = async () => {
        const storyText = `Meet ${name}, a ${age}-year-old supervillain with the following powers: ${powers.join(', ')}.`;

        try {
            const response = await fetch('/api/generate-scene', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ powers })
            });

            if (!response.ok) {
                throw new Error('Failed to generate scene.');
            }

            const data = await response.json();
            setSceneImageUrl(data.sceneImageUrl);
            setStory(storyText);
            toast.success('Story and scene generated successfully!');
        } catch (error) {
            toast.error('Failed to generate story and scene.');
        }
    };

    return (
        <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
            <Image src={imageUrl} alt={name} width={400} height={400} className="rounded-lg" />
            <h2 className="text-2xl font-bold mt-4">{name}</h2>
            <p className="mt-2 text-gray-300"><strong>Age:</strong> {age}</p>
            <p className="mt-2 text-gray-300"><strong>Powers:</strong></p>
            <ul className="list-disc list-inside text-gray-300 font-medium text-lg">
                {powers.map((power, index) => (
                    <li key={index}>{power}</li>
                ))}
            </ul>
            <button onClick={handleRentClick} className="mt-4 bg-blue-500 px-4 py-2 text-white rounded-lg transition duration-300 ease-in-out hover:bg-blue-700 font-bold text-xl">
                Rent for ${price}
            </button>
            {story && (
                <div className="mt-4 bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-lg">{story}</p>
                    {sceneImageUrl && <Image src={sceneImageUrl} alt="Scene" width={400} height={400} className="rounded-lg mt-4" />}
                </div>
            )}
        </div>
    );
}

export default SuperVillainCard;
