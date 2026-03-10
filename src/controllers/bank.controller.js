import Bank from "../models/bank.model.js";

export const createBank = async (req, res) => {
  try {
    const { name } = req.body;
    const newBank = new Bank(req.body);

    const existBank = await Bank.findOne({ name: name });

    if (existBank) {
      return res.status(400).json({
        message: "This bank is already exists",
        error: "BankExist",
      });
    }

    const bankSave = await newBank.save();

    res.status(201).json({
      message: "New bank created SuccessFully",
      data: {
        bankSave,
      },
    });
  } catch (error) {
    console.log("Error Bank creating :", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllBankData = async (req, res) => {
  try {
    const allBank = await Bank.find();

    if (allBank.length === 0) {
      return res.status(401).json({
        message: "Bank not Found!",
        error: "BankNotFount",
      });
    }
    res.status(201).json({
      message: "All bank Data fetch",
      data: {
        allBank,
      },
    });
  } catch (error) {
    console.log("Error All bank data! :", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getBankById = async (req, res) => {
  try {
    const bank = await Bank.findById(req.params.id);
    if (!bank) {
      return res.status(404).json({
        message: "Bank Not Fount!",
        error: "bankNOTFound",
      });
    }

    console.log(`Fetch the bank Data: the Id of Bank is: ${bank._id}`);
    res.status(201).json({
      message: "Bank data Found",
      data: {
        bank,
      },
    });
  } catch (error) {
    console.log("Error Bank Data:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateBank = async (req, res) => {
  try {
    const { name } = req.body;
    const bankExist = await Bank.findOne({ name: name });

    if (bankExist) {
      return res.status(401).json({
        message: "Bank All ready Exist!",
        error: "BankExist",
      });
    }

    const updateBankData = await Bank.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    console.log("Product Updates SuccessFully!");

    res.status(200).json({
      message: "Update Bank Data",
      data: {
        updateBankData,
      },
    });
  } catch (error) {
    console.log("Error Update Bank:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteBank = async (req, res) => {
  try {
    const bankDelete = await Bank.findByIdDelete(req.params.id);
    console.log("Delete bank Data SuccessFully!");
    res.status(201).json({
      message: "Delete Bank!",
      data: {
        bankDelete,
      },
    });
  } catch (error) {
    console.log("Error Delete Bank:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
