"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const electron_1 = require("electron");
const router = express_1.default.Router();
router.get('/can-prompt-touch-id', (req, res) => {
    res.json({
        result: electron_1.systemPreferences.canPromptTouchID(),
    });
});
router.post('/prompt-touch-id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield electron_1.systemPreferences.promptTouchID(req.body.reason);
        res.sendStatus(200);
    }
    catch (e) {
        res.status(400).json({
            error: e.message,
        });
    }
}));
router.get('/printers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const printers = yield electron_1.BrowserWindow.getAllWindows()[0].webContents.getPrintersAsync();
    res.json({
        printers,
    });
}));
router.post('/print', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { printer, html } = req.body;
    let printWindow = new electron_1.BrowserWindow({
        show: false,
    });
    printWindow.webContents.on('did-finish-load', () => {
        printWindow.webContents.print({
            silent: true,
            deviceName: printer,
        }, (success, errorType) => {
            res.sendStatus(200);
        });
        printWindow = null;
    });
    yield printWindow.loadURL(`data:text/html;charset=UTF-8,${html}`);
}));
exports.default = router;
