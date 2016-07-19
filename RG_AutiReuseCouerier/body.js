﻿/*
  License - Creative Commons Attribution-NoDerivatives 4.0 International License. (CC BY-ND 4.0)
  Project - Real Grace
  Author  - Starlight & Sleid & LalkaKaro4
  Script  - AutiReuseCouerier
  Version - 0.01
  https://github.com/realgrace/Dota-2-Scripts
*/
var interval = 0.1;
var MyEnt;
var courier;

function RG_AutiReuseCouerierFunc() {

	if(!Entities.IsAlive(MyEnt)) {
		return;
	}

	if(Entities.GetNumItemsInStash(MyEnt) > 0) {
		GameUI.SelectUnit(courier, false);
		Game.CastNoTarget(courier, Entities.GetAbilityByName(courier, 'courier_take_stash_and_transfer_items'), false);
	    GameUI.SelectUnit(MyEnt, false);
	}
	
	if(Entities.GetNumItemsInInventory(courier) > 0) {
		var inv = Game.GetInventory(courier);
		for(a in inv) {
			if(Items.GetPurchaser(inv[a]) == MyEnt) {
				GameUI.SelectUnit(courier, false);
		        Game.CastNoTarget(courier, Entities.GetAbilityByName(courier, 'courier_take_stash_and_transfer_items'), false);
	            GameUI.SelectUnit(MyEnt, false);
				break;
			}
		}
	}
}

var RG_AutiReuseCoueriercheckbox = function(){
	if ( !RG_AutiReuseCouerier.checked ){
		Game.ScriptLogMsg('Script disabled: RG_AutiReuseCouerier', '#ff0000');
		return;
	}
	
	MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID());
	
    var couriers = Entities.GetAllEntitiesByClassname('npc_dota_courier');
	
    for (key in couriers) {
		if (!Entities.IsEnemy(couriers[key])) {
			courier = couriers[key];
			break;
		}
	}
	
	function maincheck(){ $.Schedule( interval,function(){
		RG_AutiReuseCouerierFunc();
		if(RG_AutiReuseCouerier.checked)
			maincheck();
	})}
	maincheck();
	Game.ScriptLogMsg('Script enabled: RG_AutiReuseCouerier', '#00ff00');
}

var Temp = $.CreatePanel( "Panel", $('#scripts'), "RG_AutiReuseCouerier" )
Temp.SetPanelEvent( 'onactivate', RG_AutiReuseCoueriercheckbox )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="RG_AutiReuseCouerier" text="RG_AutiReuseCouerier"/></Panel></root>', false, false)  
var RG_AutiReuseCouerier = $.GetContextPanel().FindChildTraverse( 'RG_AutiReuseCouerier' ).Children()[0]
