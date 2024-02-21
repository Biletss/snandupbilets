const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
// const uri = "mongodb+srv://timaboyko:<cross30062008>@image.vjr3omr.mongodb.net/?retryWrites=true&w=majority";
// Подключение к MongoDB
mongoose.connect('mongodb+srv://timaboyko:cross30062008@image.vjr3omr.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Создание схемы для изображений
const imageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

const Image = mongoose.model('Image', imageSchema);

// Настройка Multer для загрузки изображений
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Обработка POST-запроса для загрузки изображения
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;

    // Сохранение изображения в базу данных
    const image = new Image({
      name: originalname,
      data: buffer,
      contentType: mimetype,
    });

    await image.save();

    res.status(201).json({ message: 'Изображение успешно загружено в базу данных' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Произошла ошибка при загрузке изображения' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
