import { useState } from "react";

export const ContactForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const localPhone = '+573156481243';
    const sanitizedPhone = phone.replace(/\D/g, '');
    const text = `
      📩 Nuevo servicio

      👤 Nombre: ${name}
      📞 Número de teléfono: ${sanitizedPhone}
      📝 Mensaje:
      ${message}
        `.trim();

    const url = `https://wa.me/${localPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} action="" className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <label htmlFor="fullName">Nombre</label>
        <input
          className="border-2 border-accent rounded-lg p-2"
          type="text"
          id="fullName"
          value={name}
          onChange={e => setName(e.currentTarget.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phoneNumber">Número de teléfono</label>
        <input
          className="border-2 border-accent rounded-lg p-2"
          type="number"
          id="phoneNumber"
          value={phone}
          onInput={e => setPhone(e.currentTarget.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message">Mensaje</label>
        <textarea
          className="border-2 border-accent rounded-lg p-2"
          name="message"
          id="message"
          value={message}
          onChange={e => setMessage(e.currentTarget.value)}
        ></textarea>
      </div>

      <button
        className="group relative overflow-hidden overflow-x-hidden rounded-md bg-primary px-8 py-2 text-neutral-50 hover:text-primary cursor-pointer border-2 border-accent w-fit"
      ><span className="relative z-10">Enviar</span><span
        className="absolute inset-0 overflow-hidden rounded-md"
      ><span
        className="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-accent transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"
      ></span></span></button>
    </form>
  )
};


