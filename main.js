/obj/item/borg/cyborg_clamp
	name = "hydraulic clamp"
	desc = "Equipment for cyborgs. Lifts objects and loads them into cargo."
	icon = 'icons/psychonaut/mob/silicon/robot_items.dmi'
	icon_state = "clamp"
	var/mob/living/silicon/robot/host = null
	var/list/stored_crates = list()
	/// Time it takes to load a crate.
	var/load_time = 3 SECONDS
	/// The max amount of crates you can carry.
	var/max_crates = 5
	/// The humans are we carrying
	var/list/carrying_humans = list()

/obj/item/borg/cyborg_clamp/Initialize(mapload)
	host = loc
	RegisterSignal(host, COMSIG_LIVING_DEATH, PROC_REF(on_death))
	return ..()

/obj/item/borg/cyborg_clamp/Destroy()
	drop_all_crates()
	return ..()

/obj/item/borg/cyborg_clamp/proc/on_death(datum/source, gibbed)
	SIGNAL_HANDLER
	drop_all_crates()

/obj/item/borg/cyborg_clamp/dropped()
	host = loc
	drop_all_crates()
	return ..()

/obj/item/borg/cyborg_clamp/equipped()
	host = loc
	return ..()

/obj/item/borg/cyborg_clamp/cyborg_unequip(mob/user)
	drop_all_crates()
	return ..()

/obj/item/borg/cyborg_clamp/AltClick(mob/living/silicon/robot/user)
	drop_all_crates()

/obj/item/borg/cyborg_clamp/proc/drop_all_crates()
	for(var/obj/crate as anything in stored_crates)
		crate.forceMove(drop_location())
		stored_crates -= crate
	carrying_humans = list()

/obj/item/borg/cyborg_clamp/proc/can_pickup(obj/target)
	if(length(stored_crates) >= max_crates)
		balloon_alert(host, "too many crates!")
		return FALSE
	for(var/mob/living/mob in target.get_all_contents())
		if(mob.mob_size <= MOB_SIZE_SMALL)
			continue
		if(mob.mob_size == MOB_SIZE_HUMAN && host.emagged)
			continue
		balloon_alert(host, "crate too heavy!")
		return FALSE
	if(target.anchored)
		balloon_alert(host, "crate is anchored!")
		return FALSE
	return TRUE

/obj/item/borg/cyborg_clamp/pre_attack(atom/target, mob/user)
	if(!user.Adjacent(target))
		return
	if(istype(target, /obj/structure/closet/crate) || istype(target, /obj/item/delivery/big))
		var/obj/picked_crate = target
		if(!can_pickup(picked_crate))
			return
		playsound(src, 'sound/mecha/hydraulic.ogg', 25, TRUE)
		if(!do_after(user, load_time, target = target))
			return
		if(!can_pickup(picked_crate))
			return
		if(!user.Adjacent(target))
			return
		stored_crates += picked_crate
		picked_crate.forceMove(src)
		for(mob/living/mob in picked_crate.get_all_contents())
			if(mob.mob_size == MOB_SIZE_HUMAN)
				carrying_humans += mob
		balloon_alert(user, "picked up [picked_crate]")
	else if(length(stored_crates))
		var/turf/target_turf = get_turf(target)
		if(isturf(target_turf) && target_turf.is_blocked_turf())
			return
		var/list/crate_radial = list()
		for(var/obj/crate as anything in stored_crates)
			crate_radial[crate] = image(icon = initial(crate.icon), icon_state = initial(crate.icon_state))
		var/obj/pick = show_radial_menu(user, target_turf, crate_radial, radius = 38, require_near = TRUE)
		if(!pick)
			return
		playsound(src, 'sound/mecha/hydraulic.ogg', 25, TRUE)
		if(!do_after(user, load_time, target = target))
			return
		if(target_turf.is_blocked_turf())
			return
		if(pick.loc != src)
			return
		if(!user.Adjacent(target))
			return
		var/obj/dropped_crate = pick
		dropped_crate.forceMove(target_turf)
		stored_crates -= pick
		for(mob/living/mob in dropped_crate.get_all_contents())
			if(mob.mob_size == MOB_SIZE_HUMAN)
				carrying_humans -= mob
		balloon_alert(user, "dropped [dropped_crate]")
	else
		balloon_alert(user, "invalid target!")

/obj/item/borg/cyborg_clamp/examine()
	. = ..()
	if(length(stored_crates))
		. += "There are [length(stored_crates)] things were picked up here."
	. += span_notice(" <i>Alt-click</i> to drop all the crates. ")
