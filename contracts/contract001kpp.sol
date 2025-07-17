// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

interface IKPPToken {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract contract001kpp {
    address public owner;
    address public immutable kppTokenAddress = 0x5fa570E9c8514cdFaD81DB6ce0A327D55251fBD4; // SEU TOKEN EXISTENTE
    address public immutable KPP_AIRDROP_CONTRACT_ADDRESS = 0x8125d4634A0A58ad6bAFbb5d78Da3b735019E237; // ENDEREÇO DO CONTRATO DE AIRDROP

    uint256 public dailyAirdropAmount = 1 * (10**18); // Valor padrão: 1 KPP por dia
    uint256 public constant CLAIM_INTERVAL = 1 days;

    mapping(address => uint256) public lastClaimTime;

    event AirdropClaimed(address indexed user, uint256 amount);
    event DailyAirdropChanged(uint256 newAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Usuários reivindicam seus KPP diários
    function claimAirdrop() external {
        require(block.timestamp >= lastClaimTime[msg.sender] + CLAIM_INTERVAL, "Wait 24h between claims");

        lastClaimTime[msg.sender] = block.timestamp;
        require(
            IKPPToken(kppTokenAddress).transfer(msg.sender, dailyAirdropAmount),
            "Transfer failed"
        );

        emit AirdropClaimed(msg.sender, dailyAirdropAmount);
    }

    // Função para o owner ajustar a quantidade do airdrop diário
    function setDailyAirdropAmount(uint256 newAmount) external onlyOwner {
        require(newAmount > 0, "Amount must be greater than 0");
        dailyAirdropAmount = newAmount;
        emit DailyAirdropChanged(newAmount);
    }

    // Funções administrativas
    function withdrawExcessKPP() external onlyOwner {
        uint256 balance = IKPPToken(kppTokenAddress).balanceOf(address(this));
        require(
            IKPPToken(kppTokenAddress).transfer(owner, balance),
            "Transfer failed"
        );
    }

    // Verifica quanto KPP o contrato tem disponível
    function contractBalance() external view returns (uint256) {
        return IKPPToken(kppTokenAddress).balanceOf(address(this));
    }
}
