import Record from './models/Record';
import Order from './models/Order';
import Menu from './models/Menu';
import moment from 'moment';

export const fakeCustomerPage = (req, res) => {
  // const categoriesWithMenu = [];
  // categoriesWithMenu.push({
  //   nameEng: 'BEST',
  //   nameKr: '추천메뉴',
  //   menus: [],
  // });
  // categories.forEach((category) => {
  //   categoriesWithMenu.push({
  //     nameEng: category.nameEng,
  //     nameKr: category.nameKr,
  //     menus: [],
  //   });
  // });
  res.render('index', {
    // pageTitle: COMPANY_NAME,
    // isCustomerPage: true, // 해당 페이지가 고객주문 페이지인지 메뉴관리 페이지인지 구별
    // categories: categoriesWithMenu,
    // drinks: [],
    // sides: [],
    // defaultDrink: {},
    // defaultSide: {},
  });
};

export const salesControllPage = async (req, res) => {
  try {
    const records = await Record.find();
    const orders = await Order.find().populate('choices.menu');
    res.status(200).render('salesControll', {
      records,
      orders,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      errors: {
        'access-error': error.message,
      },
    });
  }
};

export const getRecord = async (req, res) => {
  const { date, content } = req.body;
  const newRecord = new Record({
    date,
    content,
  });

  try {
    const record = await Record.findOne({ date: date });
    let data;
    if (!record) {
      data = await newRecord.save();
    } else {
      data = await record.update({ $set: { content } });
    }

    const records = await Record.find();
    return res.status(200).json(records);
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

export const getAllRecords = async (req, res) => {
  try {
    const records = await Record.find();
    return res.status(200).json(records);
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};

export const getOrdersForTable = async (req, res) => {
  const { start, end } = req.body;
  try {
    const orders = await Order.find({
      date: {
        $gte: new Date(start + ' 00:00:00'),
        $lte: new Date(end + ' 23:59:59'),
      },
    }).populate('choices.menu');

    return res.status(200).json(orders);
  } catch (error) {
    console.log(error.message);
    return res.status(400);
  }
};
