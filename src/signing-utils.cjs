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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getEthBalance = exports.signMessages = exports.signMessage = exports.EIP712 = void 0;
var ethers_1 = require("ethers");
var TypedDataUtils = require('ethers-eip712').TypedDataUtils;
var TYPES = {
    EIP712Domain: [
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'version',
            type: 'string'
        },
        {
            name: 'chainId',
            type: 'uint256'
        },
        {
            name: 'verifyingContract',
            type: 'address'
        }
    ],
    TxnRequest: [
        {
            name: 'to',
            type: 'address'
        },
        {
            name: 'value',
            type: 'uint256'
        },
        {
            name: 'data',
            type: 'bytes'
        },
        {
            name: 'nonce',
            type: 'bytes32'
        }
    ]
};
var getDomain = function (chainId, contractAddress) {
    return {
        name: 'MultiSig',
        version: '1.0.0',
        chainId: chainId.toString() || '1',
        verifyingContract: contractAddress || ethers_1.ethers.constants.AddressZero
    };
};
var EIP712 = function (contractAddress, chainId, params) {
    if (chainId === void 0) { chainId = 1; }
    return {
        types: TYPES,
        domain: getDomain(chainId, contractAddress),
        message: {
            to: params.to,
            value: params.value,
            data: params.data,
            nonce: params.nonce
        },
        primaryType: 'TxnRequest'
    };
};
exports.EIP712 = EIP712;
/**
 * @param  {Signer} signer - account signer
 * @param  {string} contractAddress - multisig contract address
 * @param  {Object} params - unsigned transaction payload of type TxnRequest
 */
var signMessage = function (signer, contractAddress, params) { return __awaiter(void 0, void 0, void 0, function () {
    var provider, chainId, digest, signed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                provider = signer.provider;
                return [4 /*yield*/, provider.getNetwork()];
            case 1:
                chainId = (_a.sent()).chainId;
                digest = TypedDataUtils.encodeDigest((0, exports.EIP712)(contractAddress, chainId, params));
                return [4 /*yield*/, signer.signMessage(digest)];
            case 2:
                signed = _a.sent();
                return [2 /*return*/, signed];
        }
    });
}); };
exports.signMessage = signMessage;
var signMessages = function (signers, contractAddress, params) { return __awaiter(void 0, void 0, void 0, function () {
    var signatures, i, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (signers.length === 0) {
                    throw new Error('Please supply an array of signers');
                }
                signatures = [];
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < signers.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, exports.signMessage)(signers[i], contractAddress, params)];
            case 2:
                signature = _a.sent();
                signatures.push(signature);
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, signatures];
        }
    });
}); };
exports.signMessages = signMessages;
var getEthBalance = function (provider, address) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, provider.getBalance(address)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getEthBalance = getEthBalance;
