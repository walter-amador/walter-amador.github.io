import { Icon } from '@iconify/react';
import emailjs from 'emailjs-com';
import { useState } from 'react';

const Contact = () => {

    const [result, setShowResult] = useState(false);
    const [disableSend, setdisableSend] = useState(true);
    
    //Enable/Disable send btn
    const handleEnable = (e) =>{
        const email = document.getElementById('email');
        const name = document.getElementById('name');
        const msj = document.getElementById('message');
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if(email.value !== '' && name.value !== '' && msj.value !== '' && re.test(email.value)){
            setdisableSend(false);
        }else{
            setdisableSend(true);
        }
    }

    //Send email functionality
    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_xwwia0q', 'template_5b5gfw4', e.target, 'user_3nzMXeiEhPs7xB9uJ4Vu4')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });

        e.target.reset();
        setdisableSend(true);
        setShowResult(true);
        hideSendBtn;
        clearTimeout(hideSendBtn);
    }

    //Hide respond after send email
    const hideSendBtn = setTimeout(() => {
        setShowResult(false);
    }, 6000);

    return (
        <section id="ContactSection" name="ContactSection" className="min-h-screen flex flex-col justify-center items-center">
            <h2 className="text-blue-400 text-3xl font-extrabold mx-auto my-16 text-center">Get in Touch</h2>
            <form onSubmit={sendEmail} className="w-full md:max-w-3xl mx-auto shadow-lg py-5 px-7">
                <div className="flex flex-wrap mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                            Email*
                        </label>
                        <input onChange={handleEnable} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="email" name="email" type="email" placeholder="example@gmail.com" required />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                            Name*
                        </label>
                        <input onChange={handleEnable} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="name" name="name" type="text" placeholder="Elon Musk" required />
                    </div>
                </div>
                <div className="flex flex-wrap mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="message">
                            Message*
                        </label>
                        <textarea onChange={handleEnable} className=" no-resize appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none" id="message" name="message" required></textarea>
                    </div>
                </div>
                <div className="flex items-center justify-end px-3 mb-6">
                    <button className="btn flex items-center disabled:opacity-50 disabled:cursor-default disabled:shadow-none" disabled={disableSend} type="submit">
                        <Icon icon="carbon:send-alt-filled" className="mr-2 text-lg" />Send
                    </button>
                </div>
                <div className="">
                    {result && (<p className="text-sm text-green-600">Your message has been successfully sent. I will contact you soon! Happy Hacking!</p>)}
                </div>
            </form>
        </section>
    );
}

export default Contact;
