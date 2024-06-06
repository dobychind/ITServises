import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [studNum, setStudNum] = useState('');
  const [country, setCountry] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [learnBase, setLearnBase] = useState('');
  const [formType, setFormType] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(null); // Используем null для начального значения даты

  const handleClick = () => {
    console.log(country)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('send data')
    try {
      const formattedDate = date ? `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}` : '';
      const formData = new URLSearchParams();
      formData.append('name', name);
      formData.append('last_name', lastName);
      formData.append('middle_name', middleName);
      formData.append('stud_num', studNum);
      formData.append('country', country);
      formData.append('speciality', speciality);
      formData.append('learn_base', learnBase);
      formData.append('form_type', formType);
      formData.append('reason', reason);
      formData.append('date', formattedDate);

      const response = await axios.post('http://127.0.0.1:8000/submit_form/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const filename = response.data.filename;
      const fileResponse = await axios.get(`http://127.0.0.1:8000/download/${filename}`, {
        responseType: 'blob', // указываем тип ответа
      });

      const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  };

  return (
    <div className='min-h-screen bg-slate-600 flex justify-center box-border'>
      <div className='flex flex-col justify-center items-center gap-6'>
        <h1 className='text-5xl font-bold text-white'>Заявление на отчисление</h1>
        <form className='grid grid-cols-2 gap-3 max-w-1/2 w-full items-center' onClick={handleClick} onSubmit={handleSubmit}>

        <label className='flex flex-col gap-1 w-full text-white font-semibold text-3xl'>
            Фамилия:
            <input
              className='p-2 px-6 text-black rounded-2xl'
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          <label className='flex flex-col gap-1 w-full text-white font-semibold text-3xl'>
            Имя:
            <input
              className='p-2 px-6 text-black rounded-2xl'
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          
          <label className='flex flex-col gap-1 w-full text-white font-semibold text-3xl'>
            Отчество:
            <input
              className='p-2 px-6 text-black rounded-2xl'
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              required
            />
          </label>
          <label className='flex flex-col gap-1 w-full text-white font-semibold text-3xl'>
            C/б:
            <input
              className='p-2 px-6 text-black rounded-2xl'
              type="text"
              value={studNum}
              onChange={(e) => setStudNum(e.target.value)}
              required
            />
          </label>
          <label className='flex flex-col gap-1 w-full text-white font-semibold text-3xl'>
            Гражданство:
            <input
              className='p-2 px-6 text-black rounded-2xl'
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </label>
          <label className='flex flex-col gap-1 w-full text-white font-semibold text-3xl'>
            Специальность:
            <input
              className='p-2 px-6 text-black rounded-2xl'
              type="text"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              required
            />
          </label>
          <label className='flex flex-col gap-1 w-full text-white font-semibold text-3xl'>
            Основа обучения:
            <select
              className='p-2 px-6 text-black rounded-2xl'
              value={learnBase}
              onChange={(e) => setLearnBase(e.target.value)}
              required
            >
              <option value="">Выберите основу обучения</option>
              <option value="Контракт">Контракт</option>
              <option value="Бюджет">Бюджет</option>
            </select>
          </label>
          <label className='flex flex-col gap-1 w-full text-white font-semibold text-3xl'>
            Форма обучения:
            <select
              className='p-2 px-6 text-black rounded-2xl'
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              required
            >
              <option value="">Выберите форму обучения</option>
              <option value="Очная">Очная</option>
              <option value="Заочная">Заочная</option>
            </select>
          </label>
          <label className='flex flex-col gap-1 w-full text-white font-semibold text-3xl'>
            Причина:
            <input
              className='p-2 px-6 text-black rounded-2xl'
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </label>
          <label className='flex flex-col gap-1 w-full text-white font-semibold text-3xl'>
            Дата:
            <DatePicker
              className='p-2 px-6 text-black w-full rounded-2xl'
              selected={date}
              onChange={(selectedDate) => setDate(selectedDate)}
              dateFormat="dd.MM.yyyy" // Формат даты
              required
            />
          </label>
          <button className='col-span-2 bg-amber-700 rounded-2xl text-white py-3 text-2xl font-semibold' type="submit">Сформировать документ</button>

        </form>

      </div>
    </div>
  );
}

export default App;
