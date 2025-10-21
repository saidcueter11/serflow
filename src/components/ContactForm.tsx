import { useState } from 'preact/hooks';

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
    <form onSubmit={handleSubmit} action="" class="flex flex-col gap-6 w-full">
      <div class="flex flex-col gap-2">
        <label for="fullName">Nombre</label>
        <input
          class="border-2 border-accent rounded-lg p-2"
          type="text"
          id="fullName"
          value={name}
          onChange={e => setName(e.currentTarget.value)}
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="phoneNumber">Número de teléfono</label>
        <input
          class="border-2 border-accent rounded-lg p-2"
          type="number"
          id="phoneNumber"
          value={phone}
          onInput={e => setPhone(e.currentTarget.value)}
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="message">Mensaje</label>
        <textarea
          class="border-2 border-accent rounded-lg p-2"
          name="message"
          id="message"
          value={message}
          onChange={e => setMessage(e.currentTarget.value)}
        ></textarea>
      </div>

      <button
        class="bg-accent rounded-lg text-primary font-semibold w-1/3 hover:scale-105 transition cursor-pointer"
      >Enviar</button>
    </form>
  )
};


