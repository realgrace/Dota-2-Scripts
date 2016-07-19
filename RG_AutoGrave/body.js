/*
  License - Creative Commons Attribution-NoDerivatives 4.0 International License. (CC BY-ND 4.0)
  Project - Real Grace
  Author  - Starlight & Sleid
  Script  - AutoGrave
  Version - 0.03
  https://github.com/realgrace/Dota-2-Scripts
*/

var interval = 0.1;
var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID()); 
var FEnts = []; 
var EEnts = [];
var HighPriorityPlayers = [];
var block = false;

function DazzleFunc() {
	if(!Entities.IsAlive(MyEnt) || Entities.IsSilenced(MyEnt) || Entities.IsStunned(MyEnt) || block) 
	{ return; }
	
	for(i in FEnts) {
		var e = FEnts[i];
		
		if(Entities.GetHealthPercent(e) > 30 || Entities.IsMagicImmune(e) || !Entities.IsAlive(e)) { continue; }
		
		for(j in EEnts) {
			if(Entities.GetRangeToUnit(e,EEnts[j]) > 1300 || !Entities.IsAlive(EEnts[j])) { continue; }
			
			if(Entities.GetMana(MyEnt) >= Abilities.GetManaCost(Entities.GetAbility(MyEnt,1))
			&& Abilities.GetCooldownTimeRemaining(Entities.GetAbility(MyEnt,1)) == 0 
		        && Entities.GetRangeToUnit(MyEnt,e) <= Abilities.GetCastRange(Entities.GetAbility(MyEnt,1))) {
				Game.ScriptLogMsg('Вешаю крест на '+Entities.GetUnitName(e), '#00ffff');
				Game.CastTarget(MyEnt,Entities.GetAbility(MyEnt, 1),e,false);
				block = true;
				$.Schedule(8,function () {block = false;});
			}
			
			break;
		}
		
		if(Entities.GetMana(MyEnt) >= Abilities.GetManaCost(Entities.GetAbility(MyEnt,2))
		&& Abilities.GetCooldownTimeRemaining(Entities.GetAbility(MyEnt,2)) == 0
		&& Entities.GetRangeToUnit(MyEnt,e) <= Abilities.GetCastRange(Entities.GetAbility(MyEnt,2))) {
			Game.ScriptLogMsg('Лечу '+Entities.GetUnitName(e), '#00ffff');
			Game.CastTarget(MyEnt,Entities.GetAbility(MyEnt, 2),e,false);
			block = true;
			$.Schedule(8,function () {block = false;});
			return;
		}
	}
}


var RG_AutoGravecheckbox = function(){
	if ( !RG_AutoGrave.checked ){
		Game.ScriptLogMsg('Сценарий выклюен: RG_AutoGrave', '#ff0000');
		return;
	}
	
	MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID());
	if(Entities.GetUnitName(MyEnt) != "npc_dota_hero_dazzle") {
		Game.ScriptLogMsg('Ошибка: Ваш герой не является Dazzle', '#ff0000');
		return;
	}
	
	FEnts = [];
	var HEnts = Game.PlayersHeroEnts(); 
	var players = Game.GetAllPlayerIDs(); 
 
	for (a in players) {
		var eID = Game.GetPlayerInfo(players[a]).player_steamid; 
		var ent = Players.GetPlayerHeroEntityIndex(players[a]);

		if(inArray([eID],HighPriorityPlayers) && !Entities.IsEnemy(ent) && MyEnt != ent) {
			FEnts.push(ent);
		}
	}
	
	for (i in HEnts) {
		if(!Entities.IsEnemy(HEnts[i]) && !inArray([HEnts[i]],FEnts) && Entities.GetUnitName(HEnts[i]) != "npc_dota_hero_dazzle") {
			FEnts.push(HEnts[i]);
		}
		
		if(Entities.IsEnemy(HEnts[i])) {
			EEnts.push(HEnts[i]);
		}
	}
	
	FEnts.push(MyEnt); 
	
	function maincheck(){ $.Schedule( interval,function(){
		DazzleFunc()
		if(RG_AutoGrave.checked)
			maincheck()
	})}
	
	maincheck()
	
	Game.ScriptLogMsg('Сценарий выклюен: RG_AutoGrave', '#00ff00')
}

function inArray(arr1,arr2) {
	var found = false;
	arr2.forEach( function (a) {
		arr1.forEach( function (b) {
			if(a == b) {
				found = true;
			}
		});
	});
	return found;
}


var Temp = $.CreatePanel( "Panel", $('#scripts'), "RG_AutoGrave" )
Temp.SetPanelEvent( 'onactivate', RG_AutoGravecheckbox )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="RG_AutoGrave" text="RG_AutoGrave"/></Panel></root>', false, false)  
var RG_AutoGrave = $.GetContextPanel().FindChildTraverse( 'RG_AutoGrave' ).Children()[0]
