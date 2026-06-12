// main.js - Phaser初期化・シーン登録

import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';
export { GAME_WIDTH, GAME_HEIGHT };

import BootScene from './scenes/BootScene.js';
import LobbyScene from './scenes/LobbyScene.js';
import ResultScene from './scenes/ResultScene.js';
import TitleScene from './scenes/TitleScene.js';
import ChapterSelectScene from './scenes/ChapterSelectScene.js';
import ChapterIntroScene from './scenes/ChapterIntroScene.js';
import ChapterClearScene from './scenes/ChapterClearScene.js';
import TestModeScene from './scenes/TestModeScene.js';
import MG01_SNSFire from './scenes/minigames/MG01_SNSFire.js';
import MG02_Independence from './scenes/minigames/MG02_Independence.js';
import MG03_Committee from './scenes/minigames/MG03_Committee.js';
import MG04_Infiltration from './scenes/minigames/MG04_Infiltration.js';
import MG05_SNSSpy from './scenes/minigames/MG05_SNSSpy.js';
import MG06_Meeting from './scenes/minigames/MG06_Meeting.js';
import MG07_Influence from './scenes/minigames/MG07_Influence.js';
import BOSS1_Independence from './scenes/minigames/BOSS1_Independence.js';
import MG08_MorningRush from './scenes/minigames/MG08_MorningRush.js';
import MG09_BoardBreak from './scenes/minigames/MG09_BoardBreak.js';
import MG10_DutyShift from './scenes/minigames/MG10_DutyShift.js';
import MG11_Governance from './scenes/minigames/MG11_Governance.js';
import MG12_Agenda from './scenes/minigames/MG12_Agenda.js';
import MG13_SecretDoor from './scenes/minigames/MG13_SecretDoor.js';
import MG14_Minutes from './scenes/minigames/MG14_Minutes.js';
import BOSS2_MorningPanic from './scenes/minigames/BOSS2_MorningPanic.js';
import MG15_PCGuard from './scenes/minigames/MG15_PCGuard.js';
import MG16_DocRescue from './scenes/minigames/MG16_DocRescue.js';
import MG17_TruthPick from './scenes/minigames/MG17_TruthPick.js';
import MG18_HDDSearch from './scenes/minigames/MG18_HDDSearch.js';
import MG19_ShadowDodge from './scenes/minigames/MG19_ShadowDodge.js';
import MG20_EvidenceSubmit from './scenes/minigames/MG20_EvidenceSubmit.js';
import MG21_MemoryDodge from './scenes/minigames/MG21_MemoryDodge.js';
import BOSS3_Chase from './scenes/minigames/BOSS3_Chase.js';
import MG22_NameBorrow from './scenes/minigames/MG22_NameBorrow.js';
import MG23_WriteOff from './scenes/minigames/MG23_WriteOff.js';
import MG24_Transaction from './scenes/minigames/MG24_Transaction.js';
import MG25_NameSelect from './scenes/minigames/MG25_NameSelect.js';
import MG26_Interest from './scenes/minigames/MG26_Interest.js';
import MG27_DataCatch from './scenes/minigames/MG27_DataCatch.js';
import MG28_StampDodge from './scenes/minigames/MG28_StampDodge.js';
import BOSS4_NameHunt from './scenes/minigames/BOSS4_NameHunt.js';
import MG29_Route from './scenes/minigames/MG29_Route.js';
import MG30_PaperCompany from './scenes/minigames/MG30_PaperCompany.js';
import MG31_Envelope from './scenes/minigames/MG31_Envelope.js';
import MG32_Postpone from './scenes/minigames/MG32_Postpone.js';
import MG33_NameWilling from './scenes/minigames/MG33_NameWilling.js';
import MG34_Investigation from './scenes/minigames/MG34_Investigation.js';
import BOSS5_RouteBuilder from './scenes/minigames/BOSS5_RouteBuilder.js';
import MG35_ArrowDodge from './scenes/minigames/MG35_ArrowDodge.js';
import MG36_BullDodge from './scenes/minigames/MG36_BullDodge.js';
import MG37_Windows from './scenes/minigames/MG37_Windows.js';
import MG38_Checklist from './scenes/minigames/MG38_Checklist.js';
import MG39_CultureChange from './scenes/minigames/MG39_CultureChange.js';
import MG40_SilenceBreak from './scenes/minigames/MG40_SilenceBreak.js';
import BOSS6_CultureBreakdown from './scenes/minigames/BOSS6_CultureBreakdown.js';
import MG41_StopStamp from './scenes/minigames/MG41_StopStamp.js';
import MG42_Filing from './scenes/minigames/MG42_Filing.js';
import MG43_Resistance from './scenes/minigames/MG43_Resistance.js';
import MG44_EvidenceCatch from './scenes/minigames/MG44_EvidenceCatch.js';
import MG45_LawSelect from './scenes/minigames/MG45_LawSelect.js';
import BOSS7_Trial from './scenes/minigames/BOSS7_Trial.js';
import MG46_Whistle from './scenes/minigames/MG46_Whistle.js';
import MG47_AuditGuide from './scenes/minigames/MG47_AuditGuide.js';
import MG48_SwipeOut from './scenes/minigames/MG48_SwipeOut.js';
import MG49_Dust from './scenes/minigames/MG49_Dust.js';
import MG50_Glass from './scenes/minigames/MG50_Glass.js';
import BOSS8_Tower from './scenes/minigames/BOSS8_Tower.js';
import MG51_ControlOrder from './scenes/minigames/MG51_ControlOrder.js';
import MG52_Redact from './scenes/minigames/MG52_Redact.js';
import MG53_Retire from './scenes/minigames/MG53_Retire.js';
import MG54_BestPractice from './scenes/minigames/MG54_BestPractice.js';
import MG55_Roadmap from './scenes/minigames/MG55_Roadmap.js';
import BOSS9_Runner from './scenes/minigames/BOSS9_Runner.js';
import MG56_Contradiction from './scenes/minigames/MG56_Contradiction.js';
import MG57_DocFind from './scenes/minigames/MG57_DocFind.js';
import MG58_Account from './scenes/minigames/MG58_Account.js';
import MG59_EvasiveDodge from './scenes/minigames/MG59_EvasiveDodge.js';
import MG60_TruthConnect from './scenes/minigames/MG60_TruthConnect.js';
import BOSS10_Interview from './scenes/minigames/BOSS10_Interview.js';

// 画面サイズ：iPhone基準（390×844）。constants.js で定義・re-export済み

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [
    BootScene,
    LobbyScene,
    ResultScene,
    TitleScene,
    ChapterSelectScene,
    ChapterIntroScene,
    ChapterClearScene,
    TestModeScene,
    MG01_SNSFire,
    MG02_Independence,
    MG03_Committee,
    MG04_Infiltration,
    MG05_SNSSpy,
    MG06_Meeting,
    MG07_Influence,
    BOSS1_Independence,
    MG08_MorningRush,
    MG09_BoardBreak,
    MG10_DutyShift,
    MG11_Governance,
    MG12_Agenda,
    MG13_SecretDoor,
    MG14_Minutes,
    BOSS2_MorningPanic,
    MG15_PCGuard,
    MG16_DocRescue,
    MG17_TruthPick,
    MG18_HDDSearch,
    MG19_ShadowDodge,
    MG20_EvidenceSubmit,
    MG21_MemoryDodge,
    BOSS3_Chase,
    MG22_NameBorrow,
    MG23_WriteOff,
    MG24_Transaction,
    MG25_NameSelect,
    MG26_Interest,
    MG27_DataCatch,
    MG28_StampDodge,
    BOSS4_NameHunt,
    MG29_Route,
    MG30_PaperCompany,
    MG31_Envelope,
    MG32_Postpone,
    MG33_NameWilling,
    MG34_Investigation,
    BOSS5_RouteBuilder,
    MG35_ArrowDodge,
    MG36_BullDodge,
    MG37_Windows,
    MG38_Checklist,
    MG39_CultureChange,
    MG40_SilenceBreak,
    BOSS6_CultureBreakdown,
    MG41_StopStamp,
    MG42_Filing,
    MG43_Resistance,
    MG44_EvidenceCatch,
    MG45_LawSelect,
    BOSS7_Trial,
    MG46_Whistle,
    MG47_AuditGuide,
    MG48_SwipeOut,
    MG49_Dust,
    MG50_Glass,
    BOSS8_Tower,
    MG51_ControlOrder,
    MG52_Redact,
    MG53_Retire,
    MG54_BestPractice,
    MG55_Roadmap,
    BOSS9_Runner,
    MG56_Contradiction,
    MG57_DocFind,
    MG58_Account,
    MG59_EvasiveDodge,
    MG60_TruthConnect,
    BOSS10_Interview,
  ],
};

const game = new Phaser.Game(config);

// グローバルアクセス用（デバッグ・GameManagerから）
window.__GAME__ = game;
