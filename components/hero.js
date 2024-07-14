import Image from "next/image";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuperVillainCard from "./superVillianCard";

export default function Hero() {
    const [villainName, setVillainName] = useState('');
    const [villains, setVillains] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        toast.info('Generating super-villain details...', { autoClose: false });

        try {
            const promises = Array.from({ length: 6  }, async (_, index) => {
                const response = await fetch('/api/generate-supervillain', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ villainName: villainName })
                });

                if (!response.ok) {
                    throw new Error('Failed to generate super-villain.');
                }

                const data = await response.json();
                if (data.text && data.imageUrl) {
                    const nameMatch = data.text.match(/Name:\s*(.*)/);
                    const name = nameMatch ? nameMatch[1].trim() : '';
                    const ageMatch = data.text.match(/Age:\s*(\d+)/);
                    const age = ageMatch ? ageMatch[1].trim() : '';

                    const powersMatch = data.text.match(/Powers:\s*(.*)/s);
                    const powers = powersMatch ? powersMatch[1].trim().split(/(?<=\.)\s+/) : [];
                
                    return { ...data, name, age, powers, price: (index + 1) * 10000 }; 
                } else {
                    throw new Error('Incomplete data received from server.');
                }
            });
            const villainsData = await Promise.all(promises);
            setVillains(villainsData);
            toast.dismiss();
            toast.success('Super-villains generated successfully!');
        } catch (error) {
            toast.dismiss();
            toast.error(error.message);
        }
    };

    return (
        <div className="flex justify-center items-center p-12 flex-col gap-y-6 bg-gray-900 text-white min-h-screen font-comic-neue  ">
            <ToastContainer />
            <Image src={"/logo.png"} alt="hero" width={350} height={350} />
            <h1 className="text-5xl font-bold text-center">What Kind of Villain Would You Like to Rent Today?</h1>
            <form onSubmit={handleSubmit} className="w-160 bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="relative w-full min-w-[400px] h-12 mb-4">
                    <input
                        className="peer w-full h-full bg-gray-700 text-white outline-none transition-all placeholder-shown:border-blue-500 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-lg focus:border-blue-300"
                        placeholder="Your horrendous villain goes here"
                        value={villainName}
                        onChange={(e) => setVillainName(e.target.value)}
                    />
                </div>
                <div className="flex justify-center mt-4">
                    <button type="submit" className="bg-blue-500 text-white rounded-lg px-4 py-2 items-center transition duration-300 ease-in-out hover:bg-blue-700 font-bold text-xl">
                        Submit
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {villains.map((villain, index) => (
                    <SuperVillainCard
                        key={index}
                        name={villain.name}
                        age={villain.age}
                        powers={villain.powers}
                        price={villain.price}
                        imageUrl={villain.imageUrl}
                    />
                ))}
            </div>
        </div>
    );
}
